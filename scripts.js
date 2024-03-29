
$(document).ready(function () {
    // get categories 
    var categories = [];
    var dataFromWeb = false;

    function loadCategories() {
        var categoryListEl = $("#category-list");
        categoryListEl.empty();
        for (let index = 0; index < 5; index++) {
            categoryListEl.append(/* html */`
                <li class="animate-pulse transition-all py-2 px-4 rounded-md flex gap-2 items-center justify-center bg-orang-600 w-32 border-2 border-orange-400">
                    <span class="text-md h-6 w-8  bg-orange-400 rounded-md"></span>
                    <span class="text-md h-2 w-full bg-orange-400 rounded-xl"></span>
                </li>`
            );
        }
        if (dataFromWeb) {
            $.get("https://mertalbum.com/tr/magaza", function (html) {
                console.log(html);
                var productCard = $(html).find("#cat-treeview ul li");
                var image = $(html).find("#cat-treeview ul li img");
                categories = []
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
            });
        } else {
            $.ajax({
                url: "https://mertalbum.com/test/getcategorylist",
                type: "GET",
                success: function (data) {
                    categoryListEl.empty();
                    if (data.categorylist) {
                        data.categorylist.forEach(function (category, i) {
                            categoryListEl.append(/* html */`
                    <li class="transition-all py-2 px-4 rounded-md flex gap-2 cursor-pointer items-center justify-center ${i == 0 ? "bg-orange-400 text-white" : "text-black"}" data-id="${category.id}">
                        <img src="./category.svg" class="w-5 h-5" alt="${category.name}">
                        ${category.name}
                    </li>`);
                        });
                        loadProducts(data.categorylist[0].id);
                    }

                    // Kategoriye tıklandığında ürünlerin yüklenmesi
                    categoryListEl.on("click", "li", function () {
                        var categoryId = $(this).data("id");
                        categoryListEl.find('li').removeClass("bg-orange-400");
                        categoryListEl.find('li').removeClass("text-white");
                        categoryListEl.find('li').addClass("text-black");
                        $(this).removeClass("text-black");
                        $(this).addClass("text-white");
                        $(this).addClass("bg-orange-400");
                        $("#product-list").empty();
                        loadProducts(categoryId);
                    });
                },
                error: function (xhr, status, error) {
                    console.error("API'den kategori listesi alınamadı: " + error);
                    $("#category-list").empty();
                }
            });
        }
    }
    loadCategories();
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
        // get products from api 

        if (dataFromWeb) {

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
        } else {
            $.ajax({
                url: `https://mertalbum.com/test/productlist/${categoryId}`,
                type: "GET",
                success: function (data) {
                    productList.empty();
                    if (data.productlist.length === 0) {
                        productList.append("<p>Bu kategoriye ait ürün bulunamadı.</p>");
                    } else {

                        data.productlist.forEach(function (product) {
                            productList.append(/* html */`
                            <div class="border-2 border border-orange-300 rounded-2xl overflow-hidden p-2 flex flex-wrap gap-2">
                                <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png"
                                    alt="${product.name}"
                                    class="border-2 border border-orange-300 rounded-xl w-full"
                                >
                                <h5 class="text-md w-full hover:underline cursor-pointer text-orange-900" title="${product.name}">${product.name}</h5>
                                <button class="bg-orange-400 p-2 m-0 rounded-xl h-9 flex justify-center items-center text-white border border-1 border-orange-400 hover:text-orange-400 hover:bg-white transition-all ">Sepete Ekle</button>
                            </div>
                        `);
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error("API'den ürün listesi alınamadı: " + error);
                    productList.empty();
                }
            });

        }

    }


    $('.switch').on('change', function (e) {
        dataFromWeb = e.target.checked;
        loadCategories();
        loadProducts(categories[0].id);
    })
});
