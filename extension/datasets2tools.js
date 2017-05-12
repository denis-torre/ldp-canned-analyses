//////////////////////////////////////////////////////////////////////
///////// 1. Define Main Function ////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////// Author: Denis Torre
////////// Affiliation: Ma'ayan Laboratory, Icahn School of Medicine at Mount Sinai
////////// Based on Cite-D-Lite (https://github.com/MaayanLab/Cite-D-Lite).

function main() {

	// Get Canned Analyses of corresponding datasets
	var cannedAnalysisInterfaces = API.main();

	// Add Canned Analyses to the webpage
	Page.addInterfaces(cannedAnalysisInterfaces);

	// Add event listeners for interactivity
	eventListener.main(cannedAnalysisInterfaces);

}

//////////////////////////////////////////////////////////////////////
///////// 2. Define Variables ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
////////// 1. Page ///////////////////////////////
//////////////////////////////////////////////////

///// Functions related to the webpage.

var Page = {


	//////////////////////////////
	///// 6. loadTooltips
	//////////////////////////////

	///// Loads tooltips

	loadTooltips: function() {

		$.widget("ui.tooltip", $.ui.tooltip, {
		    options: {
		        content: function () {
		            return $(this).prop('title');
		        }
		    }
		});

		$('.d2t-tooltip').each(function(i, elem) { $(elem).prev().attr('title', $(elem).remove().html());});

		$('.tool-icon').tooltip({
			classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-black tooltip-bottom tool-icon-tooltip'},
			position:{my: 'center top', at: 'center bottom+5'},
			show:{duration: 0},
			hide:{duration: 0}
		});

		$('.canned-analysis-title').tooltip({
			classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-black tooltip-bottom canned-analysis-title-tooltip'},
			position:{my: 'center top', at: 'center bottom+5'},
			show:{duration: 0},
			hide:{duration: 0}
		});

		$('.view-metadata').tooltip({
			classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-black tooltip-right view-metadata-tooltip'},
			position:{my: 'left center', at: 'left+25 center'},
			show:{duration: 0},
			hide:{duration: 0}
		});

		$('.download-metadata').tooltip({
			classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-white tooltip-right download-metadata-tooltip'},
			position:{my: 'left center', at: 'left+25 center'},
		    open:function(event, ui) { if (typeof(event.originalEvent) === 'undefined') { return false; }; var $id = $(ui.tooltip).attr('id'); $('div.ui-tooltip').not('#' + $id).remove(); },
		    close:function(event, ui) { ui.tooltip.hover(function() { $(this).stop(true).fadeTo(400, 1);; }, function() { $(this).remove(); }); },
			show:{duration: 0},
			hide:{duration: 500}
		});

		$('.share').tooltip({
			classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-white tooltip-right share-tooltip'},
			position:{my: 'left center', at: 'left+25 center'},
		    open:function(event, ui) { if (typeof(event.originalEvent) === 'undefined') { return false; }; var $id = $(ui.tooltip).attr('id'); $('div.ui-tooltip').not('#' + $id).remove(); },
		    close:function(event, ui) { ui.tooltip.hover(function() { $(this).stop(true).fadeTo(400, 1); }, function() { $(this).fadeOut('400', function() { $(this).remove(); }); }); },
			show:{duration: 0},
			hide:{duration: 500}
		});

	},

	//////////////////////////////
	///// 8. addInterfaces
	//////////////////////////////

	///// Adds interfaces to parents

	addInterfaces: function(cannedAnalysisInterfaces) {

		var datasetAccession = Object.keys(cannedAnalysisInterfaces);

		$('.tab-pane').find('.row').first().html(cannedAnalysisInterfaces[datasetAccession]['tool_table']);

		this.loadTooltips();

	}
};

//////////////////////////////////////////////////
////////// 2. API ////////////////////////////////
//////////////////////////////////////////////////

///// Functions related to the API.

var API = {

	//////////////////////////////
	///// 1. main
	//////////////////////////////

	///// Gets interfaces relevant to identified datasets from the API

	main: function(datasetAccessions) {
		cannedAnalysisInterfaces = JSON.parse($.ajax({
						async: false,
						url: 'https://amp.pharm.mssm.edu/datasets2tools/api/chrome_extension?',
						data: {
						  'page_type': 'landing',
						  'dataset_accessions': 'GSE833'//window.location.href.split('/').pop()
						},
						success: function(data) {
							return data;
						}
					}).responseText);

		return cannedAnalysisInterfaces;
	}
};

//////////////////////////////////////////////////
////////// 3. eventListener //////////////////////
//////////////////////////////////////////////////

///// Event listeners.

var eventListener = {

	clickToolbarIcon: function(cannedAnalysisInterfaces) {
		$(document).on('click', '.tool-icon-wrapper .tool-icon', function(evt) {
			var $toolIcon = $(evt.target),
				$wrapper = $toolIcon.parents('.d2t-wrapper'),
				toolName = $toolIcon.attr('data-tool-name'),
				datasetAccession = $wrapper.attr('id');
			$wrapper.replaceWith(cannedAnalysisInterfaces[datasetAccession]['canned_analysis_tables'][toolName][0]);
			Page.loadTooltips();
		})
	},

	goBack: function(cannedAnalysisInterfaces) {
		$(document).on('click', '.go-back', function(evt) {
			var $wrapper = $(evt.target).parents('.d2t-wrapper'),
				datasetAccession = $wrapper.attr('id'),
				key = Object.keys(cannedAnalysisInterfaces[datasetAccession]).indexOf('toolbar') === -1 ? 'tool_table' : 'toolbar';
			$wrapper.replaceWith(cannedAnalysisInterfaces[datasetAccession][key]);
			Page.loadTooltips();
		})
	},

	clickArrow: function(cannedAnalysisInterfaces) {
		$(document).on('click', '.arrow-wrapper .fa', function(evt) {
			var $arrow = $(evt.target),
				$wrapper = $arrow.parents('.d2t-wrapper'),
				datasetAccession = $wrapper.attr('id'),
				toolName = $wrapper.find('.tool-icon').first().attr('data-tool-name'),
				targetPage = $arrow.attr('data-target-page');
			console.log(datasetAccession);
			console.log(toolName);
			$wrapper.replaceWith(cannedAnalysisInterfaces[datasetAccession]['canned_analysis_tables'][toolName][targetPage])
			Page.loadTooltips();
		})
	},

	copy: function() {
		$(document).on('click', '.copy-wrapper button', function(evt) {
			var $button = $(evt.target).parents('.copy-wrapper').find('button');
				copyTextArea = $button.prev()[0];
			copyTextArea.select();
			var successful = document.execCommand('copy');

			$button.tooltip({
				content: 'Copied!',
			    disabled: true,
				classes:{'ui-tooltip':'tooltip-wrapper', 'ui-tooltip-content':'tooltip-black tooltip-right copied-tooltip'},
			    close: function( event, ui ) { $(this).tooltip('disable'); },
				position:{my: 'left center-5', at: 'left+35 center'},
				show:{duration: 0},
				hide:{duration: 0}
			});
			$button.tooltip('enable').tooltip('open');
		})
	},

	download: function() {
		$(document).on('click', '.download-metadata-tooltip button', function(evt) {
			var content = $(evt.target).attr('data-download'),
				filename = $(evt.target).attr('data-accession')+'.'+$(evt.target).text().toLowerCase(),
	        	a = document.createElement('a'),
	        	blob = new Blob([content], {'type':'application/octet-stream'});
	        a.href = window.URL.createObjectURL(blob);
	        a.download = filename;
	        a.click();
		})
	},

	clickPlus: function(cannedAnalysisInterfaces) {
		$(document).on('click', '.canned-analyses-cell .fa', function(evt) {
			var toolName = $(evt.target).parents('tr').first().find('.tool-name').text(),
				$wrapper = $(evt.target).parents('.d2t-wrapper')
				datasetAccession = $wrapper.attr('id');
			$wrapper.replaceWith(cannedAnalysisInterfaces[datasetAccession]['canned_analysis_tables'][toolName][0]);
			Page.loadTooltips();
		})

	},

	//////////////////////////////
	///// . main
	//////////////////////////////

	///// Main wrapper.

	main: function(cannedAnalysisInterfaces) {
		var self = this;
		this.clickToolbarIcon(cannedAnalysisInterfaces);
		this.goBack(cannedAnalysisInterfaces);
		this.clickArrow(cannedAnalysisInterfaces);
		this.copy();
		this.download();
		this.clickPlus(cannedAnalysisInterfaces);
	}
};

//////////////////////////////////////////////////////////////////////
///////// 3. Run Main Function ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////
main();
