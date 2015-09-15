/**
 * Created by danek_000 on 30.8.2015.
 */
define(
	[
		'./NFA',
		'regexParser',
		'whynotPremadePlayer'
	],
	function(
		NFA,
		regexParser,
		whynotPremadePlayer
	) {
		'use strict';

		var BiverseDFA = whynotPremadePlayer.BiverseDFA;
		var Traverser = whynotPremadePlayer.Traverser;

		function createInput(array) {
			var i = 0;
			return function () {
				return array[i++] || null;
			};
		}

		function testAutomaton () {

			// REGEXP TO DFA CONVERSION PART
			var tBeforeConversion = timeNow();

			var regexp = '(a|(bc))d(e|f)';

			var simpleMinimalDFA = NFA.regExpToSimpleMinimalDFA(regexp);

			console.log("Conversion takes " + (timeNow() - tBeforeConversion) + " milliseconds.");

			console.log(simpleMinimalDFA);

			// DFA EXECUTION PART
			var transitions = simpleMinimalDFA.transitions;

			var finalStates = simpleMinimalDFA.finalStates;

			var reverseTransitions = createReverseTransitions(transitions);

			var biverseDFA = new BiverseDFA(transitions, reverseTransitions, finalStates);

			var traverser = new Traverser(biverseDFA);

			var inputString = "abc";

			console.log("Input: " + inputString);
			console.log("");

			var tBeforeExecution = timeNow();

			var results = traverser.execute(createInput(inputString));

			console.log("Milliseconds taken: " + (timeNow() - tBeforeExecution));

			printResults(results);
		}

		function timeNow () {
			var d = new Date();
			return d.getTime();
		}

		/**
		 * Create reverse transition table out of a given transition table.
		 *
		 * @param transitions
		 * @returns {Array}
		 */
		function createReverseTransitions (transitions) {

			var reverseTransitions = [];

			var statesCount = transitions.length;

			for (var stateNumber = 0; stateNumber < statesCount; stateNumber ++) {
				reverseTransitions[stateNumber] = {};

				var stateTransitionKeys = Object.keys(transitions[stateNumber]);

				var stateTransitionKeysCount = stateTransitionKeys.length;

				for (var stateTransitionKeyId = 0; stateTransitionKeyId < stateTransitionKeysCount; stateTransitionKeyId ++) {
					var stateTransitionKey = stateTransitionKeys[stateTransitionKeyId];

					var transition = transitions[stateNumber][stateTransitionKey];

					var transitionString = transition + '';

					if (reverseTransitions[stateNumber][transitionString] === undefined) {
						reverseTransitions[stateNumber][transitionString] = [];
					}

					reverseTransitions[stateNumber][transitionString].push(stateTransitionKey);
				}
			}

			return reverseTransitions;
		}

		/**
		 * Prints the results of an automaton execution.
		 *
		 * @param results
		 */
		function printResults (results) {
			var resultsCount = results.length;

			for (var resultId = 0; resultId < resultsCount; resultId ++) {

				console.log("\nResult #" + resultId + ":");

				var currentRecord = results[resultId];

				console.log("Accepted: " + currentRecord.getAcceptedCount());

				console.log("Missing: " + currentRecord.getMissingCount());

				var reverseResults = [];

				while (currentRecord !== null) {

					if(currentRecord.getPreviousRecord() === null) {
						break;
					}

					var addPosition = currentRecord.getAcceptedCount() + currentRecord.getMissingCount() - 1;

					reverseResults.unshift([currentRecord.getAccepted(), currentRecord.getCharacters(), addPosition]);

					currentRecord = currentRecord.getPreviousRecord();
				}

				var reverseResultsCount = reverseResults.length;

				for (var reverseResultId = 0; reverseResultId < reverseResultsCount; reverseResultId ++) {
					var charStatus = reverseResults[reverseResultId][0] ? "Accepted" : "Missing";

					var missingPosition = !reverseResults[reverseResultId][0] ?
					" to be added at position " + reverseResults[reverseResultId][2] : "";

					console.log(charStatus, reverseResults[reverseResultId][1], missingPosition);
				}

				console.log("");
			}
		}

		testAutomaton();

		return {
			Automaton: Traverser
		};
	}
);
