/**
 * GazeAnalyzer - Sistema de Eye-Tracking para E-Commerce
 * Integra WebGazer.js y Heatmap.js para análisis de usabilidad
 */

class GazeAnalyzer {
    constructor() {
        // Estado del sistema
        this.state = {
            calibrated: false,
            recording: false,
            paused: false
        };

        // Datos de seguimiento
        this.gazePoints = [];
        this.sessionStart = null;
        this.timerInterval = null;

        // Calibración
        this.calibrationClicks = {};
        this.requiredClicks = 5;
        this.totalCalibrationPoints = 9;

        // Heatmap
        this.heatmap = null;

        // Tareas disponibles
        this.tasks = [
            "Busca el botón 'Comprar Ahora' en el banner principal",
            "Encuentra el producto 'Apple Watch Series 9' y su precio",
            "Localiza el carrito de compras en el header",
            "Busca la sección de ofertas (Flash Sale)",
            "Encuentra el formulario de suscripción al newsletter",
            "Localiza la categoría de 'Gaming' en la navegación"
        ];

        // Referencias DOM
        this.dom = {};

        this.init();
    }

    /**
     * Inicialización
     */
    init() {
        this.cacheDom();
        this.createHeatmap();
        this.attachEvents();
        this.initWebGazer();
    }

    /**
     * Cachear elementos del DOM
     */
    cacheDom() {
        this.dom = {
            // Toolbar
            btnCalibrate: document.getElementById('btn-calibrate'),
            btnRecord: document.getElementById('btn-record'),
            btnPause: document.getElementById('btn-pause'),
            btnHeatmap: document.getElementById('btn-heatmap'),
            btnReset: document.getElementById('btn-reset'),
            btnDownload: document.getElementById('btn-download'),

            // Stats
            fixationCount: document.getElementById('fixation-count'),
            duration: document.getElementById('duration'),
            recordingStatus: document.getElementById('recording-status'),

            // Task
            taskDescription: document.getElementById('task-description'),

            // Calibración
            calibrationOverlay: document.getElementById('calibration-overlay'),
            calibrationPoints: document.querySelectorAll('.cal-point'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            btnSkipCalibration: document.getElementById('btn-skip-calibration'),

            // Cursor
            gazeCursor: document.getElementById('gaze-cursor'),

            // Container
            mainContainer: document.getElementById('main-container')
        };
    }

    /**
     * Crear instancia de Heatmap
     */
    createHeatmap() {
        this.heatmap = h337.create({
            container: this.dom.mainContainer,
            radius: 35,
            maxOpacity: 0.75,
            minOpacity: 0.05,
            blur: 0.8,
            gradient: {
                0.0: '#0000ff',
                0.2: '#00ffff',
                0.4: '#00ff00',
                0.6: '#ffff00',
                0.8: '#ff8000',
                1.0: '#ff0000'
            }
        });
    }

    /**
     * Vincular eventos
     */
    attachEvents() {
        // Botones del toolbar
        this.dom.btnCalibrate.addEventListener('click', () => this.openCalibration());
        this.dom.btnRecord.addEventListener('click', () => this.toggleRecording());
        this.dom.btnPause.addEventListener('click', () => this.togglePause());
        this.dom.btnHeatmap.addEventListener('click', () => this.showHeatmap());
        this.dom.btnReset.addEventListener('click', () => this.resetAll());
        this.dom.btnDownload.addEventListener('click', () => this.downloadData());
        this.dom.btnSkipCalibration.addEventListener('click', () => this.skipCalibration());

        // Puntos de calibración
        this.dom.calibrationPoints.forEach(point => {
            point.addEventListener('click', (e) => this.handleCalibrationClick(e));
        });

        // Teclas de atajo
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.dom.calibrationOverlay.classList.remove('active');
            }
            if (e.key === ' ' && this.state.calibrated) {
                e.preventDefault();
                this.toggleRecording();
            }
        });
    }

    /**
     * Inicializar WebGazer
     */
    async initWebGazer() {
        this.updateStatus('Iniciando cámara...');

        try {
            await webgazer
                .setRegression('ridge')
                .setTracker('TFFacemesh')
                .setGazeListener((data, timestamp) => {
                    if (data) {
                        this.onGazeUpdate(data.x, data.y, timestamp);
                    }
                })
                .saveDataAcrossSessions(true)
                .begin();

            // Configurar preview de video
            webgazer
                .showVideoPreview(true)
                .showPredictionPoints(false)
                .applyKalmanFilter(true);

            // Posicionar video
            const videoContainer = document.getElementById('webgazerVideoContainer');
            if (videoContainer) {
                Object.assign(videoContainer.style, {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    top: 'auto',
                    left: 'auto',
                    width: '180px',
                    height: '135px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
                });
            }

            this.updateStatus('Listo para calibrar');

        } catch (error) {
            console.error('Error inicializando WebGazer:', error);
            this.updateStatus('Error: Permita acceso a cámara');
        }
    }

    /**
     * Callback cuando hay datos de mirada
     */
    onGazeUpdate(x, y, timestamp) {
        // Actualizar cursor visual
        if (this.state.recording && !this.state.paused) {
            this.updateCursor(x, y);
            this.recordPoint(x, y, timestamp);
        } else if (this.state.calibrated) {
            this.updateCursor(x, y);
        }
    }

    /**
     * Actualizar posición del cursor
     */
    updateCursor(x, y) {
        this.dom.gazeCursor.style.left = `${x}px`;
        this.dom.gazeCursor.style.top = `${y}px`;
    }

    /**
     * Registrar punto de mirada
     */
    recordPoint(x, y, timestamp) {
        const container = this.dom.mainContainer;
        const rect = container.getBoundingClientRect();

        // Verificar si está dentro del contenedor
        const relX = x - rect.left;
        const relY = y - rect.top + container.scrollTop;

        if (relX >= 0 && relX <= rect.width && y >= rect.top) {
            this.gazePoints.push({
                x: Math.round(relX),
                y: Math.round(relY),
                timestamp,
                viewport: { x: Math.round(x), y: Math.round(y) }
            });

            this.dom.fixationCount.textContent = this.gazePoints.length;
        }
    }

    /**
     * Abrir modal de calibración
     */
    openCalibration() {
        this.calibrationClicks = {};
        this.dom.calibrationPoints.forEach(p => {
            p.classList.remove('done');
            p.dataset.clicks = '0';
        });
        this.updateCalibrationProgress();
        this.dom.calibrationOverlay.classList.add('active');
    }

    /**
     * Manejar clic en punto de calibración
     */
    handleCalibrationClick(e) {
        const point = e.target;
        const pos = point.dataset.pos;

        // Incrementar contador
        let clicks = parseInt(point.dataset.clicks || '0') + 1;
        point.dataset.clicks = clicks;

        // Registrar en WebGazer
        const rect = point.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        webgazer.recordScreenPosition(x, y, 'click');

        // Feedback visual
        point.style.transform = 'scale(1.3)';
        setTimeout(() => {
            point.style.transform = '';
        }, 150);

        // Verificar si está completo
        if (clicks >= this.requiredClicks) {
            point.classList.add('done');
            this.calibrationClicks[pos] = true;
        }

        this.updateCalibrationProgress();
        this.checkCalibrationComplete();
    }

    /**
     * Actualizar barra de progreso de calibración
     */
    updateCalibrationProgress() {
        const completed = Object.keys(this.calibrationClicks).length;
        const percent = Math.round((completed / this.totalCalibrationPoints) * 100);

        this.dom.progressFill.style.width = `${percent}%`;
        this.dom.progressText.textContent = `${percent}% completado (${completed}/${this.totalCalibrationPoints} puntos)`;
    }

    /**
     * Verificar si la calibración está completa
     */
    checkCalibrationComplete() {
        const completed = Object.keys(this.calibrationClicks).length;

        if (completed >= this.totalCalibrationPoints) {
            setTimeout(() => {
                this.completeCalibration();
            }, 500);
        }
    }

    /**
     * Completar calibración
     */
    completeCalibration() {
        this.state.calibrated = true;
        this.dom.calibrationOverlay.classList.remove('active');

        // Habilitar botones
        this.dom.btnRecord.disabled = false;
        this.dom.gazeCursor.classList.add('active');

        // Asignar tarea
        this.assignTask();

        this.updateStatus('Calibrado');
        this.dom.recordingStatus.classList.add('calibrated');
    }

    /**
     * Omitir calibración (baja precisión)
     */
    skipCalibration() {
        this.state.calibrated = true;
        this.dom.calibrationOverlay.classList.remove('active');
        this.dom.btnRecord.disabled = false;
        this.dom.gazeCursor.classList.add('active');
        this.assignTask();
        this.updateStatus('Sin calibrar (baja precisión)');
    }

    /**
     * Asignar tarea aleatoria
     */
    assignTask() {
        const randomTask = this.tasks[Math.floor(Math.random() * this.tasks.length)];
        this.dom.taskDescription.textContent = randomTask;
    }

    /**
     * Iniciar/detener grabación
     */
    toggleRecording() {
        if (!this.state.recording) {
            this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    /**
     * Iniciar grabación
     */
    startRecording() {
        this.state.recording = true;
        this.state.paused = false;
        this.sessionStart = Date.now();

        // Iniciar timer
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        // Actualizar UI
        this.dom.btnRecord.innerHTML = '<span class="icon">⏹️</span> Detener';
        this.dom.btnPause.disabled = false;
        this.dom.btnCalibrate.disabled = true;
        this.dom.recordingStatus.textContent = 'Grabando';
        this.dom.recordingStatus.className = 'status-badge recording';

        this.updateStatus('Grabando...');
    }

    /**
     * Detener grabación
     */
    stopRecording() {
        this.state.recording = false;
        this.state.paused = false;

        clearInterval(this.timerInterval);

        // Actualizar UI
        this.dom.btnRecord.innerHTML = '<span class="icon">⏺️</span> Grabar';
        this.dom.btnPause.disabled = true;
        this.dom.btnCalibrate.disabled = false;
        this.dom.btnHeatmap.disabled = false;
        this.dom.btnDownload.disabled = false;
        this.dom.recordingStatus.textContent = 'Detenido';
        this.dom.recordingStatus.className = 'status-badge';

        this.updateStatus(`Capturados ${this.gazePoints.length} puntos`);
    }

    /**
     * Pausar/reanudar grabación
     */
    togglePause() {
        this.state.paused = !this.state.paused;

        if (this.state.paused) {
            this.dom.btnPause.innerHTML = '<span class="icon">▶️</span> Reanudar';
            this.dom.recordingStatus.textContent = 'Pausado';
            this.dom.recordingStatus.className = 'status-badge paused';
        } else {
            this.dom.btnPause.innerHTML = '<span class="icon">⏸️</span> Pausar';
            this.dom.recordingStatus.textContent = 'Grabando';
            this.dom.recordingStatus.className = 'status-badge recording';
        }
    }

    /**
     * Actualizar timer
     */
    updateTimer() {
        if (!this.sessionStart || this.state.paused) return;

        const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');

        this.dom.duration.textContent = `${mins}:${secs}`;
    }

    /**
     * Mostrar mapa de calor
     */
    showHeatmap() {
        if (this.gazePoints.length === 0) {
            alert('No hay datos para mostrar. Grabe primero.');
            return;
        }

        // Agregar puntos
        const aggregated = this.aggregatePoints();

        this.heatmap.setData({
            max: Math.max(...aggregated.map(p => p.value)),
            min: 0,
            data: aggregated
        });

        this.updateStatus('Mapa de calor generado');

        // Cambiar texto del botón
        this.dom.btnHeatmap.innerHTML = '<span class="icon">🔥</span> Actualizar';
    }

    /**
     * Agregar puntos cercanos para el heatmap
     */
    aggregatePoints() {
        const grid = {};
        const cellSize = 25;

        this.gazePoints.forEach(point => {
            const gx = Math.floor(point.x / cellSize) * cellSize;
            const gy = Math.floor(point.y / cellSize) * cellSize;
            const key = `${gx}-${gy}`;

            if (!grid[key]) {
                grid[key] = { x: gx, y: gy, value: 0 };
            }
            grid[key].value++;
        });

        return Object.values(grid);
    }

    /**
     * Reiniciar todo
     */
    resetAll() {
        // Detener si está grabando
        if (this.state.recording) {
            this.stopRecording();
        }

        // Limpiar datos
        this.gazePoints = [];
        this.heatmap.setData({ max: 1, min: 0, data: [] });

        // Reset UI
        this.dom.fixationCount.textContent = '0';
        this.dom.duration.textContent = '00:00';
        this.dom.btnHeatmap.innerHTML = '<span class="icon">🔥</span> Heatmap';
        this.dom.btnHeatmap.disabled = true;
        this.dom.btnDownload.disabled = true;

        this.updateStatus('Datos reiniciados');
    }

    /**
     * Descargar datos JSON
     */
    downloadData() {
        if (this.gazePoints.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        const exportData = {
            metadata: {
                fecha: new Date().toISOString(),
                puntosTotales: this.gazePoints.length,
                duracion: this.dom.duration.textContent,
                tarea: this.dom.taskDescription.textContent,
                resolucion: {
                    ancho: window.innerWidth,
                    alto: window.innerHeight
                }
            },
            puntosDeMirada: this.gazePoints,
            analisis: this.generateAnalysis()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `gaze-data-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Generar análisis de datos
     */
    generateAnalysis() {
        if (this.gazePoints.length === 0) return null;

        // Definir zonas de la página
        const zones = {
            topBar: { minY: 0, maxY: 35, count: 0 },
            header: { minY: 35, maxY: 150, count: 0 },
            navigation: { minY: 150, maxY: 200, count: 0 },
            heroBanner: { minY: 200, maxY: 500, count: 0 },
            categories: { minY: 500, maxY: 750, count: 0 },
            products: { minY: 750, maxY: 1200, count: 0 },
            promoBanner: { minY: 1200, maxY: 1350, count: 0 },
            newsletter: { minY: 1350, maxY: 1500, count: 0 },
            footer: { minY: 1500, maxY: Infinity, count: 0 }
        };

        // Contar puntos por zona
        this.gazePoints.forEach(point => {
            for (const [name, zone] of Object.entries(zones)) {
                if (point.y >= zone.minY && point.y < zone.maxY) {
                    zone.count++;
                    break;
                }
            }
        });

        // Calcular porcentajes
        const total = this.gazePoints.length;
        const distribution = {};

        for (const [name, zone] of Object.entries(zones)) {
            distribution[name] = {
                puntos: zone.count,
                porcentaje: ((zone.count / total) * 100).toFixed(1) + '%'
            };
        }

        // Centroide de atención
        const avgX = this.gazePoints.reduce((sum, p) => sum + p.x, 0) / total;
        const avgY = this.gazePoints.reduce((sum, p) => sum + p.y, 0) / total;

        return {
            distribucionPorZona: distribution,
            centroideAtencion: {
                x: Math.round(avgX),
                y: Math.round(avgY)
            },
            totalFijaciones: total
        };
    }

    /**
     * Actualizar estado en la UI
     */
    updateStatus(message) {
        console.log(`[GazeAnalyzer] ${message}`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gazeAnalyzer = new GazeAnalyzer();
});
