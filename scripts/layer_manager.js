/*
 * File        layer_manager.js
 * Author      ChatGPT 5.6 Sol, ZirconiumTian
 * Last Edited 2026/10/03 17:52
 * License     Apache License 2.0
 * About       A lightweight layer management extension for TurboWarp. It allows
 *             sprites to be assigned to specific rendering layers, providing
 *             predictable z-order control for user interfaces, canvas objects,
 *             overlays, and other layered components.
 */

(function (Scratch) {
	'use strict';

	if (!Scratch.extensions.unsandboxed) {
		throw new Error(
			Scratch.translate({
				id: 'layermanager.error.unsandboxed',
				default: 'Layer Manager must run without sandboxing.'
			})
		);
	}

	Scratch.translate.setup({
		'zh-cn': {
			'layermanager.name': '图层管理',
			'layermanager.setLayer': '设置角色图层到 [LAYER]',
			'layermanager.getLayer': '角色当前图层',
			'layermanager.error.unsandboxed': '图层管理扩展必须以非沙箱模式运行'
		},

		en: {
			'layermanager.name': 'Layer Manager',
			'layermanager.setLayer': 'set sprite layer to [LAYER]',
			'layermanager.getLayer': 'sprite layer',
			'layermanager.error.unsandboxed': 'Layer Manager must run without sandboxing.'
		}
	});

	class LayerManager {
		getInfo() {
			return {
				id: 'layermanager',
				name: Scratch.translate({id: 'layermanager.name', default: 'Layer Manager'}),
				color1: '#6C7AE0',
				color2: '#5664C9',
				color3: '#4855B2',
				blocks: [
					{
						opcode: 'setLayer',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate({
							id: 'layermanager.setLayer',
							default: 'set sprite layer to [LAYER]'
						}),
						filter: [Scratch.TargetType.SPRITE],
						arguments: {
							LAYER: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0
							}
						}
					},
					{
						opcode: 'getLayer',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate({
							id: 'layermanager.getLayer',
							default: 'sprite layer'
						}),
						filter: [Scratch.TargetType.SPRITE]
					}
				]
			};
		}

		setLayer(args, util) {
			const target = util.target;
			if (!target || target.isStage) return;
			const renderer = util.runtime.renderer;
			const drawableID = target.drawableID;
			if (!renderer || drawableID === null || drawableID === undefined) {
				return;
			}
			let layer = Number(args.LAYER);
			if (!Number.isFinite(layer)) {
				layer = 0;
			}
			layer = Math.trunc(layer);
			renderer.setDrawableOrder(drawableID, layer, 'sprite', false);
		}

		getLayer(args, util) {
			const target = util.target;
			if (!target || target.isStage) return 0;
			const renderer = util.runtime.renderer;
			const drawableID = target.drawableID;
			if (!renderer || drawableID === null || drawableID === undefined) {
				return 0;
			}
			return renderer.getDrawableOrder(drawableID);
		}
	}

	Scratch.extensions.register(new LayerManager());

})(Scratch);