let currentPage = 0;
let maxPages = 0;

function more() {
    if(currentPage < maxPages - 1) {
        $.ajax({
            url: "api/userHistory?page=" + (currentPage + 1),
            type: "get",
            dataType: "json"
        }).done(function (purchases) {
            for(let i=0; i<purchases.length; i++) {
                let purchase = purchases[i];
                $("#purchases-container").append(
                    "           <div class=\"card mb-4 shadow-sm purchase-box\">\n" +
                    "                <div class=\"card-header\">\n" +
                    "                    <h3 class=\"softFont\">Order ID: " + purchase.id + "</h3>\n" +
                    "                    <h5 class=\"softFont\">Date: " + purchase.date + "</h5>\n" +
                    "                    <h4 class=\"softFont\">Status: " + purchase.type + "</h4>\n" +
                    "                </div>\n" +
                    "                <div class=\"card-body\">\n" +
                    "                    <table class=\"table\">\n" +
                    "                        <tbody id=\"purchase-" + purchase.id + "\" class=\"cart\">\n" +
                    "                        </tbody>\n" +
                    "                        <tfoot>\n" +
                    "                        <tr>\n" +
                    "                            <td></td>\n" +
                    "                            <td></td>\n" +
                    "                            <td class=\"text-right\">Total: </td>\n" +
                    "                            <td class=\"text-right\"><strong class=\"total\">" + purchase.totalPrice + "</strong></td>\n" +
                    "                        </tr>\n" +
                    "                        </tfoot>\n" +
                    "                        \n" +
                    "                    </table>\n" +
                    "                </div>\n" +
                    "            </div>"
                );
                for(let i=0; i<purchase.transactionEntries.length; i++) {
                    let entry = purchase.transactionEntries[i];
                    $("#purchase-" + purchase.id).append(
                        "                        <tr>\n" +
                        "                            <td>#" + (i + 1) + "</td>\n" +
                        "                            <td style=\"padding: 0;\"><form action=\"/productView\" method=\"post\" style=\"margin-top: 0; padding: 0;\">\n" +
                        "                                <a class=\"btn border-0\" href=\"/productView/" + entry.product.id + "\">" + entry.product.name + "</a>\n" +
                        "                            </td>\n" +
                        "                            <td>" + entry.quantity + " x $" + entry.product.price + "</td>\n" +
                        "                            <td class=\"text-right\">$" + entry.totalPrice + "</td>\n" +
                        "                        </tr>\n"
                    );
                }
                if(purchase.coupon != null) {
                    $("#purchase-" + purchase.id).append(
                        "                        <tr>\n" +
                        "                            <td></td>\n" +
                        "                            <td class=\"text-right\">Discount coupon \"" + purchase.coupon.code + "\":</td>\n" +
                        "                            <td></td>\n" +
                        "                            <td class=\"text-right\">-$" + purchase.discount + "</td>\n" +
                        "                        </tr>\n"
                    );
                }
            }
            currentPage++;
            if(currentPage >= maxPages - 1) {
                $("#more-btn").hide();
            }
        });

    }
}

$(document).ready(function () {
    maxPages = Number($("#max-pages").attr("content"));
});