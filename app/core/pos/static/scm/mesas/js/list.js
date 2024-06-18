var tblSale;
var input_daterange;

function getData(all) {
    var parameters = {
        'action': 'search',
        'start_date': input_daterange.data('daterangepicker').startDate.format('YYYY-MM-DD'),
        'end_date': input_daterange.data('daterangepicker').endDate.format('YYYY-MM-DD'),
    };

    if (all) {
        parameters['start_date'] = '';
        parameters['end_date'] = '';
    }

    tblSale = $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: pathname,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: parameters,
            dataSrc: ""
        },
        columns: [
            {data: "id"},
            {data: "client.user.full_name"},
            {data: "date_joined"},
            {data: "mesa_numero"},
            {data: null},
            {data: null},
            {data: "total"},
            {data: "id"},
        ],
        columnDefs: [
            {
                targets: [4],
                class: 'text-center',
                render: function (data, type, row) {
                    if (row.estado_entrega === true) {
                        return '<button class="btn btn-success btn-xs btn-flat btn-change-status" onclick="cambiarEstado(' + row.id + ',1,' + row.mesa_id +')"><i class="fas fa-check"></i> Entregado</button>';
                    }
                    return '<button class="btn btn-danger btn-xs btn-flat btn-change-status" onclick="cambiarEstado(' + row.id + ',1,' + row.mesa_id +')"><i class="fas fa-utensils"></i> Entregar</button>';
                }
            },
            {
                targets: [5],
                class: 'text-center',
                render: function (data, type, row) {
                    if (row.estado_pago === true) {
                        return '<button class="btn btn-success btn-xs btn-flat btn-change-status" onclick="cambiarEstado(' + row.id + ',2,' + row.mesa_id +')"><i class="fas fa-check"></i> Cancelado</button>';
                    }
                    return '<button class="btn btn-info btn-xs btn-flat btn-change-status" onclick="cambiarEstado(' + row.id + ',2,' + row.mesa_id +',' + row.estado_entrega +')"><i class="fas fa-money-bill"></i> Cobrar</button>';
                }
            },
            {
                targets: [-2],
                class: 'text-center',
                render: function (data, type, row) {
                    return 'S/.' + parseFloat(data).toFixed(2);
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                render: function (data, type, row) {
                    var buttons = '';
                    buttons += '<a class="btn btn-info btn-xs btn-flat" rel="detail"><i class="fas fa-folder-open"></i></a> ';
                    buttons += '<a href="/pos/crm/sale/print/voucher/' + row.id + '/" target="_blank" class="btn btn-primary btn-xs btn-flat"><i class="fas fa-print"></i></a> ';
                    buttons += '<a href="/pos/crm/sale/admin/delete/' + row.id + '/" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash"></i></a> ';
                    return buttons;
                }
            },
        ],
        rowCallback: function (row, data, index) {

        },
        initComplete: function (settings, json) {

        }
    });
}

$(function () {

    input_daterange = $('input[name="date_range"]');

    $('#data tbody')
        .off()
        .on('click', 'a[rel="detail"]', function () {
            $('.tooltip').remove();
            var tr = tblSale.cell($(this).closest('td, li')).index();
            var row = tblSale.row(tr.row).data();
            $('#tblDetails').DataTable({
                // responsive: true,
                // autoWidth: false,
                destroy: true,
                ajax: {
                    url: pathname,
                    type: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: {
                        'action': 'search_detproducts',
                        'id': row.id
                    },
                    dataSrc: ""
                },
                scrollX: true,
                scrollCollapse: true,
                columns: [
                    {data: "product.name"},
                    {data: "product.category.name"},
                    {data: "price"},
                    {data: "cant"},
                    {data: "subtotal"},
                    {data: "dscto"},
                    {data: "total_dscto"},
                    {data: "total"},
                ],
                columnDefs: [
                    {
                        targets: [-1, -2, -4, -6],
                        class: 'text-center',
                        render: function (data, type, row) {
                            return 'S/.' + parseFloat(data).toFixed(2);
                        }
                    },
                    {
                        targets: [-3],
                        class: 'text-center',
                        render: function (data, type, row) {
                            return parseFloat(data).toFixed(2) + '%';
                        }
                    },
                    {
                        targets: [-5],
                        class: 'text-center',
                        render: function (data, type, row) {
                            return data;
                        }
                    }
                ]
            });

            var invoice = [];
            invoice.push({'id': 'Cliente', 'name': row.client.user.full_name});
            invoice.push({'id': 'Subtotal', 'name': 'S/.' + row.subtotal});
            invoice.push({'id': 'Total a pagar', 'name': 'S/.' + row.total});
            if (row.payment_method.id === 'efectivo') {
                invoice.push({'id': 'Efectivo', 'name': 'S/.' + row.cash});
                invoice.push({'id': 'Vuelto', 'name': 'S/.' + row.change});
            } else if (row.payment_method.id === 'tarjeta_debito_credito') {
                invoice.push({'id': 'Número de tarjeta', 'name': row.card_number});
                invoice.push({'id': 'Titular de tarjeta', 'name': row.titular});
                invoice.push({'id': 'Monto a debitar', 'name': 'S/.' + row.amount_debited});
            } else if (row.payment_method.id === 'efectivo_tarjeta') {
                invoice.push({'id': 'Efectivo', 'name': 'S/.' + row.cash});
                invoice.push({'id': 'Número de tarjeta', 'name': row.card_number});
                invoice.push({'id': 'Titular de tarjeta', 'name': row.titular});
                invoice.push({'id': 'Monto a debitar', 'name': 'S/.' + row.amount_debited});
            }

            $('#tblInvoice').DataTable({
                responsive: true,
                autoWidth: false,
                destroy: true,
                data: invoice,
                paging: false,
                ordering: false,
                info: false,
                columns: [
                    {data: "id"},
                    {data: "name"},
                ],
                columnDefs: [
                    {
                        targets: [0, 1],
                        class: 'text-left',
                        render: function (data, type, row) {
                            return data;
                        }
                    },
                ]
            });

            $('.nav-tabs a[href="#home"]').tab('show');

            $('#myModalDetails').modal('show');
        })

    input_daterange
        .daterangepicker({
            language: 'auto',
            startDate: new Date(),
            locale: {
                format: 'YYYY-MM-DD',
            }
        })
        .on('apply.daterangepicker', function (ev, picker) {
            getData(false);
        });

    $('.drp-buttons').hide();

    getData(false);

    $('.btnSearch').on('click', function () {
        getData(false);
    });

    $('.btnSearchAll').on('click', function () {
        getData(true);
    });
});

//veterinaria
function cambiarEstado(sale_id,action,mesa_id,estado_entrega) {
    if(arguments.length==4){
        if(action==2 && !estado_entrega){
            return alert("Este pedido aún no se ha entregado")
        }
    }
    fetch('/pos/scm/orders/updatestate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            sale_id,
            action,
            mesa_id
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cambiar el estado del pedido');
        }
        console.log('Estado cambiado con éxito.');
        // Actualizar la tabla de datos si es necesario
        $('#data').DataTable().ajax.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


