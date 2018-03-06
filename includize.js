/*** INCLUDIZE.js                                           ***/
/*** into root page (ex. index.html)                        ***/
/*** include the script everywhere you want                 ***/
/*** after that create any include tag like below           ***/
/*** <include src="templates/new-inclusion.html"></include> ***/
/*** wich includes html code to add                         ***/

(function() {
    window.onload = function() {
        var parser=new DOMParser();
        
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
            var qr = new XMLHttpRequest();
            qr.open('get',url);
            qr.send();
            qr.onreadystatechange = function(){
                if (qr.readyState === 4) {
                    var html = parser.parseFromString(this.responseText, "text/html");
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
                    console.log(include);
                    include.parentNode.removeChild(include);
                    id_include++;
                }
            }
        })
    }
})()