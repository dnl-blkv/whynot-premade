/**
 * Created by danek_000 on 15.9.2015.
 *
 * Generic VM-based formal language matching framework.
 * This module provides an API object which exposes the usual entry points for this library.
 *
 * @module whynotPremadeCompiler
 */
define(
	[
		'./Compiler'
	],
	function(
		Compiler
	) {
		'use strict';

		return {
			Compiler: Compiler
		};
	}
);
