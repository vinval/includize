/*** INCLUDIZE.js                                                                   ***/
/*** into root page (ex. index.html)                                                ***/
/*** include the script everywhere you want                                         ***/
/*** after that create any include tag like below                                   ***/
/*** <include src='templates/new-inclusion.html' data='{"text":"world"}'></include> ***/
/*** wich includes html code to add                                                 ***/

(function() {

    window.onload = function() {

        function includize () {
            var parser=new DOMParser();
            
            var replaceCurlyBraces = function(t, data) {
                var regExp = new RegExp(/{{(.*?)}}/, "g");
                var matches = [];
                var array = [];
                try {
                    matches = t.match(regExp);
                } catch (e) {
                    console.log(e);
                }
                var array = [];
                matches.forEach(function(match){
                    var value = match.replace("{{","").replace("}}",""); 
                    t = t.replace(match, data[value]);
                })
                return t;
            };

            var getChildIndex = function(child){
                var parent = child.parentNode;
                var children = parent.children;
                var i = children.length - 1;
                for (; i >= 0; i--){
                    if (child == children[i]){
                        break;
                    }
                }
                return i+2;
            };
            
            /*** include external templates into position ***/
            var includesTAG = [].slice.call(document.querySelectorAll("include"));
            var id_include = 0;
            includesTAG.forEach(function(include){
                var url = include.getAttribute("src");
                var data = JSON.parse(include.getAttribute("data")); // definire i dati da trasferire nel nuovo elemento
                var qr = new XMLHttpRequest();
                qr.open('get',url);
                qr.send();
                qr.onreadystatechange = function(){
                    if (qr.readyState === 4) {
                        var html = parser.parseFromString(replaceCurlyBraces(this.responseText, data), "text/html");
                        var nodes = [].slice.call(html.body.childNodes);
                        var n = nodes.length-1;
                        for (; n>=0; n--) {
                            var node = document.createElement("node");//include.cloneNode(true);
                            var id = "node_tmp_"+id_include+"_"+n;
                            node.setAttribute("id", id);
                            if (include.parentNode) {
                                include.parentNode.insertBefore(node, include.parentNode.childNodes[getChildIndex(include)]);
                                include.parentNode.replaceChild(html.body.childNodes[n],document.getElementById(id));
                            }
                        }
                        if (include.parentNode) include.parentNode.removeChild(include);
                        id_include++;
                    }
                }
            })
        }
        
        var observeDOM = (function(){
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;
            
            return function(obj, callback){
                if( MutationObserver ){
                    // define a new observer
                    var obs = new MutationObserver(function(mutations, observer){
                        if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                    });
                    // have the observer observe foo for changes in children
                    obs.observe( obj, { childList:true, subtree:true });
                }
                else if( eventListenerSupported ){
                    obj.addEventListener('DOMNodeInserted', callback, false);
                    obj.addEventListener('DOMNodeRemoved', callback, false);
                }
            };
        })();

        includize();
        
        // Observe a specific DOM element:
        observeDOM(document.body ,function(){ 
            includize();
        });
    
    }

})()
