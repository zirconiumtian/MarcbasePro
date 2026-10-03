/*
 * File        layer_manager.js
 * Author      ChatGPT 5.6 Sol, ZirconiumTian
 * Last Edited 2026/10/03 18:44
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
			'Layer Manager must run without sandboxing.'
		);
	}

	/*
	 * Localization
	 */

	Scratch.translate.setup({
		'zh-cn': {
			'layermanager.name': '图层管理',
			'layermanager.setLayer': '设置角色图层到 [LAYER]',
			'layermanager.getLayer': '角色当前图层'
		},
		en: {
			'layermanager.name': 'Layer Manager',
			'layermanager.setLayer': 'set sprite layer to [LAYER]',
			'layermanager.getLayer': 'sprite layer'
		}
	});

	class LayerManager {
		constructor() {
			/*
			 * Logical layer values.
			 *
			 * Key:
			 *   target.id
			 *
			 * Value:
			 *   integer layer
			 */
			this.layers = new Map();

			/*
			 * Stable ordering for sprites sharing the same layer.
			 *
			 * Example:
			 *
			 * A -> layer 100, sequence 0
			 * B -> layer 100, sequence 1
			 *
			 * B will remain above A unless another ordering
			 * mechanism is added later.
			 */
			this.sequence = new Map();
			this.nextSequence = 0;
		}

		getInfo() {
			return {
				id: 'layermanager',
				name: Scratch.translate({
					id: 'layermanager.name',
					default: 'Layer Manager'
				}),

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

						filter: [
							Scratch.TargetType.SPRITE
						],

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
						filter: [
							Scratch.TargetType.SPRITE
						]
					}
				]
			};
		}

		/*
		 * Assign a logical layer to the current sprite.
		 */
		setLayer(args, util) {
			const target = util.target;

			if (!target || target.isStage) {
				return;
			}
			let layer = Number(args.LAYER);
			if (!Number.isFinite(layer)) {
				layer = 0;
			}
			layer = Math.trunc(layer);

			/*
			 * Register stable same-layer ordering when this
			 * target is first seen.
			 */
			if (!this.sequence.has(target.id)) {
				this.sequence.set(target.id, this.nextSequence++);
			}
			this.layers.set(target.id, layer);
			this.normalize(util.runtime);
		}

		/*
		 * Return the logical layer value, NOT the renderer's
		 * internal drawable index.
		 */
		getLayer(args, util) {
			const target = util.target;
			if (!target || target.isStage) {
				return 0;
			}
			return this.layers.get(target.id) ?? 0;
		}

		/*
		 * Convert logical layer ordering into Scratch Render's
		 * actual drawable ordering.
		 */
		normalize(runtime) {
			if (!runtime) {
				return;
			}
			const renderer = runtime.renderer;
			if (!renderer) {
				return;
			}

			/*
			 * Collect all drawable sprite targets.
			 */
			const targets = runtime.targets.filter(target => {
				if (!target) {
					return false;
				}
				if (target.isStage) {
					return false;
				}
				if (target.drawableID === null || target.drawableID === undefined) {
					return false;
				}
				return true;
			});

			/*
			 * Ensure sprites which have never explicitly used
			 * "set sprite layer" still participate normally.
			 *
			 * Their default logical layer is 0.
			 */
			for (const target of targets) {
				if (!this.sequence.has(target.id)) {
					this.sequence.set(target.id, this.nextSequence++);
				}
			}

			/*
			 * Sort:
			 *
			 * 1. Logical layer, ascending.
			 * 2. Stable sequence, ascending.
			 *
			 * Therefore larger layer numbers end up closer
			 * to the front of the renderer.
			 */
			targets.sort((a, b) => {
				const layerA = this.layers.get(a.id) ?? 0;
				const layerB = this.layers.get(b.id) ?? 0;
				if (layerA !== layerB) {
					return layerA - layerB;
				}
				const sequenceA = this.sequence.get(a.id) ?? 0;
				const sequenceB = this.sequence.get(b.id) ?? 0;
				return sequenceA - sequenceB;
			});

			/*
			 * Apply the resulting order.
			 *
			 * `order` is the actual index inside Scratch
			 * Render's sprite layer group.
			 */
			for (let order = 0; order < targets.length; order++) {
				renderer.setDrawableOrder(targets[order].drawableID, order, 'sprite', false);
			}
		}
	}

	Scratch.extensions.register(new LayerManager());

})(Scratch);