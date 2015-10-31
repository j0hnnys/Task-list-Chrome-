tasksController = function() { 
	var taskPage;
	var initialised = false;
	
	function errorLogger(errorCode, errorMessage) {
		console.log(errorCode + ':' + errorMessage);
	}
	
	function loadTask(csvTask) {
		var tokens = $.csv.toArray(csvTask);
		if (tokens.length == 3) {
			var task = {};
			task.task = tokens[0];
			task.requiredBy = tokens[1];
			task.category = tokens[2];
			return task;
		}
		return null;
	}
	
	function loadFromCSV(event) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			var contents = evt.target.result;
			var lines = contents.split('\n');
			var tasks = [];
			$.each(lines, function(indx, val) {
				if (indx >= 1 && val) {
					var task = loadTask(val);
					if (task) {
						tasks.push(task);
					}
				}
			});
			storageEngine.saveAll('task', tasks, function() {
				tasksController.loadTasks();
			}, errorLogger);
		};
		reader.onerror = function(evt) {
			errorLogger('cannot_read_file', 'The file specified cannot be read');
		};
		reader.readAsText(event.target.files[0]);
	}
	
	return { 
		init : function(page) { 
			if (!initialised) {
				taskPage = page;
				
				$(taskPage).find('[required="required"]').prev('label').append( '<span>*</span>').children( 'span').addClass('required');
				
				$(taskPage).find('tbody tr:even').addClass('even');
				
				$(taskPage).find('#btnAddTask').click(function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskCreation').removeClass('not');
				});
				
				$(taskPage).find('tbody tr').click(function(evt) {
					$(evt.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
				});
				
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
					storageEngine.delete('task', $(evt.target).data().taskId, function() {
						$(evt.target).parents('tr').remove();
					}, errorLogger);
				});
				
				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', function(evt) {
					$(taskPage).find('#taskCreation').removeClass('not');
					storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
						$(taskPage).find('form').fromObject(task);
					}, errorLogger);
				});
				
				$(taskPage).find('#saveTask').click(function(evt) {
					
					if ($(taskPage).find('form').valid()) {
						
						var task = $(taskPage).find('form').toObject();
						console.log('This is the task to save: ' + task);
						
						storageEngine.save('task', task, function() {
						
							$(taskPage).find('#tblTasks body').empty();
							tasksController.loadTasks();
							$(':input').val('');
							$(taskPage).find('#tasksCreation').addClass('not');
						
						}, errorLogger);
					}
				});
				
				$('#importFile').change(loadFromCSV);
				
				initialised = true;
			}
		},
		loadTasks: function() {
			storageEngine.findAll('task', function(tasks) {
				$.each(tasks, function(index, task) {
					$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
				});
			}, errorLogger);
		},
		printProperty: function(obj, property) {
			console.log(obj[property]);
		}
		 
	} 
}();
