# progress


When serenix_create_progress.js loaded, it creates the global function createProgress. To create progress element, call the function createProgress with options object as argument.


## Examples

```js
            var sync = {
                applyTo: { updatable: '[[previous-element]]', prefix: 'No labeled progress (', sufix: '%):'}
            };
            var prg1 = createProgress({ id: "no-labeled-progress", withLabel: false, value: 75, barColor: 'lightgreen'});
            var prg2 = createProgress({ id: "no-labeled-progress2", withLabel: false, value: 30, barColor: 'orange'});
            var prg3 = createProgress({ id: "no-labeled-progress3", withLabel: false, value: 50, barColor: 'cyan', height: 10, editable: false});
            var prg4 = createProgress({ id: "no-labeled-progress4", withLabel: false, value: 25, height: 5, editable: false, focusable: false});
            
            var colors = ['blue', 'orange', 'lightgreen', 'green'];
            var cprg1 = createProgress({ id: "colored-no-labeled-progress", withLabel: false, value: 75, colors: colors});
            var cprg2 = createProgress({ id: "colored-no-labeled-progress2", withLabel: false, value: 30, colors: colors});
            var cprg3 = createProgress({ id: "colored-no-labeled-progress3", withLabel: false, value: 50, colors: colors, height: 10, editable: false});
            var cprg4 = createProgress({ id: "colored-no-labeled-progress4", withLabel: false, value: 25, height: 5, editable: false, colors: colors});
            var cprg80 = createProgress({ id: "colored-no-labeled-progress80", withLabel: false, value: 80, colors: colors, synchronizer: sync});
            var cprg60 = createProgress({ id: "colored-no-labeled-progress60", withLabel: false, value: 60, colors: colors, height: 8, editable: false});
            var cprg44 = createProgress({ id: "colored-no-labeled-progress44", withLabel: false, value: 44, colors: colors, synchronizer: sync});
            
            //colors = [{min:50, color: 'green', exclusiveMin: true}];
            colors = [{min:50, color: 'green'}];
            
            var cprg1 = createProgress({ id: "min-colored-no-labeled-progress", withLabel: false, value: 75, colors: colors, height: 5, editable: false});
            var cprg2 = createProgress({ id: "min-colored-no-labeled-progress2", withLabel: false, value: 30, colors: colors, synchronizer: sync});
            var cprg3 = createProgress({ id: "min-colored-no-labeled-progress3", withLabel: false, value: 50, colors: colors, height: 10, editable: false});
            var cprg4 = createProgress({ id: "min-colored-no-labeled-progress4", withLabel: false, value: 25, height: 5, editable: false, colors: colors});
            var cprg80 = createProgress({ id: "min-colored-no-labeled-progress80", withLabel: false, value: 80, colors: colors, synchronizer: sync});
            var cprg60 = createProgress({ id: "min-colored-no-labeled-progress60", withLabel: false, value: 60, colors: colors, synchronizer: sync});
            var cprg44 = createProgress({ id: "min-colored-no-labeled-progress44", withLabel: false, value: 44, colors: colors, synchronizer: sync});
            
            //colors = [{no-focusable:50, color: 'green', exclusiveMin: true}];
            colors = [{max:35, color: 'purple', exclusiveMax:true}, {max:60, color: 'magenta', exclusiveMax:true}, {min:80, color: 'yellow', focusable: false}];
            var cprg1 = createProgress({ id: "no-focusable-colored-no-labeled-progress", withLabel: false, value: 75, colors: colors, height: 5, focusable: false});
            var cprg2 = createProgress({ id: "no-focusable-colored-no-labeled-progress2", withLabel: false, value: 30, colors: colors, height: 1, focusable: false});
            var cprg3 = createProgress({ id: "no-focusable-colored-no-labeled-progress3", withLabel: false, value: 50, colors: colors, height: 10, focusable: false});
            var cprg4 = createProgress({ id: "no-focusable-colored-no-labeled-progress4", withLabel: false, value: 25, height: 2, focusable: false, colors: colors});
            var cprg80 = createProgress({ id: "no-focusable-colored-no-labeled-progress80", withLabel: false, value: 80, colors: colors, height: 5, focusable: false});
            var cprg60 = createProgress({ id: "no-focusable-colored-no-labeled-progress60", withLabel: false, value: 60, colors: colors, height: 8, focusable: false});
            var cprg44 = createProgress({ id: "no-focusable-colored-no-labeled-progress44", withLabel: false, value: 44, colors: colors, height: 3, focusable: false});
            var cprg44 = createProgress({ id: "no-focusable-colored-no-labeled-progress79", withLabel: false, value: 79, colors: colors, height: 5, focusable: false});
```



## Examples capture

### Non-editing captures

![image](https://user-images.githubusercontent.com/4527986/224483000-47a42d24-38ac-4ba6-a8f6-fee8862c97ba.png)

### Editing capture

![image](https://user-images.githubusercontent.com/4527986/224483140-411d1e52-79c9-4cb9-9c42-4a91732d2ee2.png)

