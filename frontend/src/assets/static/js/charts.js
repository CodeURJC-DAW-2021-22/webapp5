
const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
const randomRGB = () => `rgba(${randomNum()}, ${randomNum()}, ${randomNum()}, 0.2)`;

function loadCharts(){
    $.ajax({
        url: "/apiadmin/statics",
        type: "GET"
    }).done(function(response) {
        console.log(response)
        let label = []
        let dataIncomes = []
        let dataSales = []
        let backgroundColor = []
        response.forEach(product =>{
            console.log(product)
            label.push(product.productName)
            dataIncomes.push(product.incomes)
            dataSales.push(product.sales)
            backgroundColor.push(randomRGB())
        })
        initCharts(label, dataIncomes, dataSales, backgroundColor)
    })
}

function initCharts(label, dataIncomes, dataSales, backgroundColor){
    var ctx_incomes = document.getElementById('Incomes');

    var Incomes = new Chart(ctx_incomes, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                data: dataIncomes,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(43, 6, 23)',
                borderWidth: 2,
                label: 'quantity (u)',
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Incomes chart",
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var ctx_sales = document.getElementById('Sales');

    var Sales = new Chart(ctx_sales, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                data: dataSales,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(43, 6, 23)',
                borderWidth: 2,
                label: 'dollars ($)',
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Sales chart",
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

$(document).ready(function() {
    loadCharts();
});