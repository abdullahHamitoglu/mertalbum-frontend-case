$(document).ready(function () {
    // get categories 
    var categories = [];
    // categories loader
    var categoryListEl = $("#category-list");
    for (let index = 0; index < 5; index++) {
        categoryListEl.append(/* html */`
            <li class="animate-pulse transition-all py-2 px-4 rounded-md flex gap-2 items-center justify-center bg-orang-600 w-32 border-2 border-orange-400">
                <span class="text-md h-6 w-8  bg-orange-400 rounded-md"></span>
                <span class="text-md h-2 w-full bg-orange-400 rounded-xl"></span>
            </li>`
        );
    }
    // Kategorilerin Website'den alınması ve listelenmesi

    $.get("https://mertalbum.com/tr/magaza", function (html) {
        console.log(html);
        // find #cat-treeview
        var productCard = $(html).find("#cat-treeview ul li");
        var image = $(html).find("#cat-treeview ul li img");
        productCard.each(function (index) {
            categories.push({
                id: parseInt($(this).attr('class').slice(8, 10)),
                name: $(this).find('a').text(),
                link: $(this).find('a').attr('href'),
                image: $(this).find('img').attr('src')
            })
        });
        categoryListEl.empty();
        categories.forEach(function (category, i) {
            categoryListEl.append(/* html */`
            <li class="transition-all py-2 px-4 rounded-md flex gap-2 cursor-pointer items-center justify-center border-2 border-orange-400 ${i == 0 ? "bg-orange-400 text-white" : "text-black"}" data-id="${category.id}">
                <img src="${category.image}" class="w-5 h-5" alt="${category.name}">
                ${category.name}
            </li>`);
        });
        categoryListEl.on("click", "li", function () {
            var categoryId = $(this).data("id");
            categoryListEl.find('li').removeClass("bg-orange-400");
            categoryListEl.find('li').removeClass("text-white");
            categoryListEl.find('li').addClass("text-black");
            $(this).removeClass("text-black");
            $(this).addClass("text-white");
            $(this).addClass("bg-orange-400");
            $("#product-list").empty();
            window.location.hash = categoryId;
            loadProducts(categoryId);
        });
        loadProducts(categories[0].id);
        console.log(categories);
    });
    // Ürünlerin API'den alınması ve listelenmesi
    function loadProducts(categoryId) {
        var products = [];
        var productList = $("#product-list");

        // add card loader before get products 
        productList.empty();
        if (productList.length) {
            for (let index = 0; index < 5; index++) {
                productList.append(/* html */`
                <div class="animate-pulse border-2 border border-orange-300 rounded-2xl overflow-hidden p-2 flex flex-wrap gap-2">
                <span class="border-2 border border-orange-300 bg-orange-200 rounded-xl h-56 w-full"></span>
                <span class="text-md h-4 w-full bg-orange-300 rounded-xl"></span>
                <span class="bg-orange-400 p-2 m-0 rounded-xl h-9 w-28"></span>
                </div>
                `);
            }
        }

        // get products from website
        $.get(`https://mertalbum.com/tr/magaza/kategori/${categoryId}`, function (html) {
            var productCard = $(html).find(".product-item");
            products = [];
            productCard.each(function (index) {
                products.push({
                    id: parseInt($(this).attr('class').slice(11, 13)),
                    name: $(this).find('.product-info span').text(),
                    link: $(this).find('a').attr('href'),
                    image: $(this).find('img').attr('src')
                })
            })
            productList.empty();
            products.forEach(function (product, i) {
                productList.append(/* html */`
                    <div class="border-2 border border-orange-300 rounded-2xl overflow-hidden p-2 flex flex-wrap gap-2">
                        <img src="${product.image}"
                            alt="${product.name}"
                            class="border-2 border border-orange-300 rounded-xl w-full"
                        >
                        <h5 class="text-md w-full hover:underline cursor-pointer text-orange-900" title="${product.name}">${product.name}</h5>
                        <button class="bg-orange-400 p-2 m-0 rounded-xl h-9 flex justify-center items-center text-white border border-1 border-orange-400 hover:text-orange-400 hover:bg-white transition-all addToCart">
                            Sepete Ekle
                        </button>
                    </div>
                `);
            })
        })
    }
}); 