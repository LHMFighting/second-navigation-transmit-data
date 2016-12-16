$(document).ready(function(){
    var menu = [
            {"type_id":1,"name":"大菜","food":[
                                            {"food_id":1,"name":"鱼香肉丝","price":"10"},
                                            {"food_id":2,"name":"红烧肉","price":"11"},
                                            {"food_id":3,"name":"香辣粉","price":"12"}
                                            ]},
            {"type_id":2,"name":"中菜","food":[
                                            {"food_id":4,"name":"小炒肉","price":"13"},
                                            {"food_id":5,"name":"云吞","price":"14"}
                                            ]},
            {"type_id":3,"name":"小菜","food":[
                                            {"food_id":6,"name":"雪糕","price":"15"},
                                            {"food_id":7,"name":"黄瓜","price":"16"}
                                            ]}      
    ];

    var max_food_id = 1;
    dropMenu();

    /*绘制出二级联动菜单*/
    function dropMenu(){
        for (var i = 0; i < menu.length; i++) {
            var a1 = $("<a href='#'></a>").text(menu[i].name); /*一级菜名类型*/
            var icon_next = $("<span></span>").addClass("next");
            /*二级菜单*/
            var two_menu = $("<span></span>").text(menu[i].name);
            var span_add = $("<sapn></sapn>");
            span_add.addClass("add");
            two_menu.addClass("two-menu");
            var ul2 = $("<ul></ul>").append(two_menu,span_add);
            ul2.addClass("droppable1");
            var li1 = $("<li></li>").append(a1,icon_next,ul2);
            li1.attr("index",i);
            li1.attr("draggable","true");
            li1.addClass("droppable");
            $(".menu").append(li1);
            /*增加具体菜名类型下的菜名*/
            for(var j = 0; j < menu[i].food.length; j++){
                var span_del = $("<span></span>");
                var span_modi = $("<span></span>");
                span_del.addClass("del");
                span_modi.addClass("modifier");
                var li2 = $("<li></li>").text(menu[i].food[j].name+":"+menu[i].food[j].price);
                li2.append(span_del,span_modi);
                li2.attr("index",j);
                li2.attr("draggable","true");
                li2.addClass("column");
                ul2.append(li2);
                if(menu[i].food[j].food_id > max_food_id){
                    max_food_id = menu[i].food[j].food_id
                }
            }
        }
        $(".menu li").mouseover(function(){
            $(this).find("ul").show();
        });
        $(".menu li").mouseout(function(){
            $(this).find("ul").hide();
        });
       add_event();
       drag();
    }
    function add_event(){
        $(".add").click(addMenu);
        $(".del").click(delMenu);
        $(".modifier").click(modifiMenu);
    }
    /*增加，删除，修改的模态框*/
    var $modal_overlay = $("#modal-overlay");
    var $modal_overlay_del = $("#modal-overlay-del");
    var $modal_overlay_modifi = $("#modal-overlay-modifi");
    var indexMenu;          /*menu的一级菜单下标*/
    var indexMenu2;         /*menu的二级菜单下标*/

    /*增加数据*/
    function addMenu(){
        $("#menu-name").val('');
        $("#menu-price").val('');
        openModal($modal_overlay)
        indexMenu = $(this).parents("li").attr("index");
    }
    $(".remodal-confirm").click(function(){
        var addData = {
            food_id:max_food_id+1,
            name:$("#menu-name").val(),
            price: $("#menu-price").val()
        }
        menu[indexMenu].food.push(addData);
        redraw($modal_overlay);
    });
    $(".overlay").click(function(){
        closeModal($modal_overlay);
    });
    $(".remodal-cancel").click(function(){
        closeModal($modal_overlay);
    });

    /*删除数据*/
    function delMenu(){
        $("#del-data").text($(this).parent().text());
        openModal($modal_overlay_del)
        indexMenu = $(this).parent().parents("li").attr("index") ;
        indexMenu2 = $(this).parent().attr("index");
    }
    $(".remodal-confirm-del").click(function(){
        menu[indexMenu].food.splice(indexMenu2,1);
        redraw($modal_overlay_del);
    });
    $(".overlay-del").click(function(){
        closeModal($modal_overlay_del)
    });
    $(".remodal-cancel-del").click(function(){
        closeModal($modal_overlay_del);
    });

    /*修改数据*/
    function modifiMenu(){
        $("#del-data").text($(this).parent().text());
        openModal($modal_overlay_modifi)
        indexMenu = $(this).parent().parents("li").attr("index") ;
        indexMenu2 = $(this).parent().attr("index");
        $("#menu-name-modifi").val(menu[indexMenu].food[indexMenu2].name);
        $("#menu-price-modifi").val(menu[indexMenu].food[indexMenu2].price);
    }
    $(".remodal-confirm-modifi").click(function(){
        menu[indexMenu].food[indexMenu2].name = $("#menu-name-modifi").val();
        menu[indexMenu].food[indexMenu2].price = $("#menu-price-modifi").val();

        redraw($modal_overlay_modifi);
    });
    $(".overlay-modifi").click(function(){
        closeModal($modal_overlay_modifi)
    });
    $(".remodal-cancel-modifi").click(function(){
        closeModal($modal_overlay_modifi)
    });

    /*打开模态框*/
    function openModal(obj){
        var showOrHide = obj.css("visibility")=="visible"?"hidden":"visible";
        obj.css('visibility',showOrHide);
    }
    /*关闭模态框*/
    function closeModal(obj){
        obj.css('visibility',"hidden");
    }
    /*重绘*/
    function redraw(obj){
        $(".menu").empty();
        dropMenu();
        closeModal(obj);
    }

    //拖拉
    function drag(){
        function handleDragStart(e) {
            this.style.opacity = '1';
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            add_event();
        }
        function handleDragEnter(e) {
            this.classList.add('over');
        }
        function handleDragLeave(e) {
            this.classList.remove('over');
        }
        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }

        //拖拽完成后，作用在拖拽元素上
        function handleDrop(e) {
            /*同级之间的交换*/
            if (dragSrcEl != this) {
//                console.log(dragSrcEl);/*被拖拉-0*/
                console.log(this);/*放置位置-1*/
                var parentIndex = this.parentNode.parentNode.getAttribute("index");
                var temp = menu[parentIndex].food[dragSrcEl.getAttribute("index")];
                menu[parentIndex].food[dragSrcEl.getAttribute("index")] = menu[parentIndex].food[this.getAttribute("index")];
                menu[parentIndex].food[this.getAttribute("index")] = temp;
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }
            return false;
        }

        //拖拽完成后，作用在被拖拽元素上
        function handleDragEnd(e) {
            this.style.opacity = '1';
            [].forEach.call(divs, function(d) {
                d.classList.remove('over');
            });
            add_event();
        }

        function drop_menu(ev)
        {
//            console.log(dragSrcEl)/*被拖动*/
//            console.log(this)/*放置的位置*/
            var $dragSrcEl = $(dragSrcEl);
            var $ul_dest = $(this.childNodes[2]);
            var src_index1 = $dragSrcEl.parents("li").attr("index");
            var src_index2 = $dragSrcEl.attr("index");
            var des_index1 = $(this).attr("index");
            var dex_index2 = parseInt($ul_dest.children().last().attr("index"))+1;
            if(src_index1 != des_index1){
                menu[des_index1].food[dex_index2] = menu[src_index1].food[src_index2];
                menu[src_index1].food.splice(src_index2,1);
                $(".menu").empty();
                dropMenu();
                add_event();
            }

            ev.preventDefault();
        }

        var divs = document.querySelectorAll('.column');

        [].forEach.call(divs, function(d) {
            d.addEventListener('dragstart', handleDragStart, false);/*规定了被拖动的元素*/
            d.addEventListener('dragenter', handleDragEnter, false);
            d.addEventListener('dragover', handleDragOver, false);/*在何处放置被拖动的元素*/
            d.addEventListener('dragleave', handleDragLeave, false);
            d.addEventListener('drop', handleDrop, false);
            d.addEventListener('dragend', handleDragEnd, false);
        });

        var ul = document.querySelectorAll(".droppable");
        [].forEach.call(ul,function(e){
            e.addEventListener('drop',drop_menu,false);
            e.addEventListener('dragover',handleDragOver,false);
        });
    }
});

/*
    step 1: 根据menu的数据，动态生成一个二级联运菜单
    step 2: 实现动态增加、修改、删除菜单dom节点，同时保持dom结构与json保持同步
    step 3: 实现通过拖拽修改菜单结构（可使用jQuery插件），同时保持dom结构与json保持同步
*/