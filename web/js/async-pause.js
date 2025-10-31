import { getNodeByExecutionId } from './traversal.js'
import { api } from '../../../scripts/api.js';
import { app } from '../../../scripts/app.js';
import { sounds, default_sound, soundPath } from './sounds.js';
// @ts-ignore
app.api.addEventListener('entering_pause_loop', (event) => {
    const executionId = event.detail.executionId;
    const node = getNodeByExecutionId(app.rootGraph, executionId);
    node.executionId = executionId;
});
app.registerExtension({
    name: 'AsyncPause.Pause',
    settings: [
        {
            // @ts-ignore
            id: 'AsyncPause.CancelButton',
            name: 'Add a cancel button to the Pause node to interrupt the current run',
            type: 'boolean',
            defaultValue: false,
            tooltip: 'Requires a browser refresh to take effect',
            category: ['Async Pause', 'Cancel button', 'pause.cancel.button']
        }
    ],
    async nodeCreated(node, app) {
        if (node.comfyClass === 'Pause') {
            const continue_btn = node.addWidget('button', 'continue', '', async () => {
                const extendedNode = node;
                const response = await api.fetchApi('/async_pause/continue', {
                    method: 'POST',
                    body: JSON.stringify({
                        executionId: extendedNode.executionId
                    })
                });
                if (response.status != 200) {
                    app.extensionManager.toast.add({
                        severity: 'error',
                        summary: 'Pause node',
                        detail: 'Internal server error',
                        life: 3000
                    });
                }
            }, { serialize: false });
            continue_btn.label = 'continue';
            continue_btn.tooltip = 'Continue execution of following nodes';
            if (app.extensionManager.setting.get('AsyncPause.CancelButton')) {
                const cancel_btn = node.addWidget('button', 'cancel', '', () => {
                    api.fetchApi('/interrupt', {
                        method: 'POST'
                    });
                });
                cancel_btn.label = 'cancel';
                cancel_btn.tooltip = 'Cancel current run';
            }
        }
    }
});
app.registerExtension({
    name: 'AsyncPause.NotifyAudio',
    settings: [
        {
            // @ts-ignore
            id: 'AsyncPause.PlayWhenSelected',
            name: 'Play when selected',
            category: [
                'Async Pause',
                'Notification sound',
                'notify.audio.play.when.changed'
            ],
            type: 'boolean',
            defaultValue: true,
            tooltip: 'Wether to play the notifiation sound when selected in the dropdown list'
        }
    ],
    async nodeCreated(node) {
        if (node.comfyClass === 'NotifyAudioOutput' ||
            node.comfyClass === 'NotifyAudioPassthrough') {
            node.onExecuted = function () {
                el.pause();
                el.currentTime = 0;
                el.play();
            };
            const sound = node.addWidget('combo', 'sound', default_sound, (value) => {
                el.pause();
                el.src = api.fileURL(soundPath(value));
                if (app.extensionManager.setting.get('AsyncPause.PlayWhenSelected')) {
                    el.play();
                }
            }, {
                values: Object.keys(sounds).sort((a, b) => a.localeCompare(b))
            });
            sound.label = 'sound';
            const el = document.createElement('audio');
            el.controls = true;
            el.style.display = 'hidden';
            el.classList.add('comfy-audio');
            el.setAttribute('name', 'media');
            el.preload = 'auto';
            el.currentTime = 0;
            el.volume = 0.5;
            el.src = api.fileURL(soundPath(default_sound));
            node.onGraphConfigured = () => {
                el.src = api.fileURL(soundPath(sound.value));
            };
            const slider = node.addWidget('slider', 'volume', 50, (value) => {
                el.volume = value / 100;
            }, { min: 0, max: 100, step2: 1 });
            slider.label = 'volume';
        }
    }
});
app.registerExtension({
    name: 'AsyncPause.Toast',
    async nodeCreated(node, app) {
        if (node.comfyClass === 'NotifyToastOutput' ||
            node.comfyClass === 'NotifyToastPassthrough') {
            node.onExecuted = function () {
                var _a, _b, _c, _d, _e, _f;
                app.extensionManager.toast.add({
                    summary: 'Toast node executed',
                    // @ts-ignore
                    severity: (_b = (_a = node.widgets) === null || _a === void 0 ? void 0 : _a.find((w) => w.name === 'severity')) === null || _b === void 0 ? void 0 : _b.value,
                    detail: (_d = (_c = node.widgets) === null || _c === void 0 ? void 0 : _c.find((w) => w.name === 'detail')) === null || _d === void 0 ? void 0 : _d.value,
                    life: (_f = (_e = node.widgets) === null || _e === void 0 ? void 0 : _e.find((w) => w.name === 'life')) === null || _f === void 0 ? void 0 : _f.value
                });
            };
        }
    }
});
