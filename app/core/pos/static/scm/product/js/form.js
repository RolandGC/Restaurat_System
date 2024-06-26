var fv;
var select_category;
var form_group;

document.addEventListener('DOMContentLoaded', function (e) {
    const form = document.getElementById('frmForm');
    fv = FormValidation.formValidation(form, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    name: form.querySelector('[name="name"]').value,
                                    category: form.querySelector('[name="category"]').value,
                                    action: 'validate_data'
                                };
                            },
                            message: 'El producto ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                category: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione una categoría'
                        },
                    }
                },
                image: {
                    validators: {
                        file: {
                            extension: 'jpeg,jpg,png',
                            type: 'image/jpeg,image/png',
                            maxFiles: 1,
                            message: 'Introduce una imagen válida'
                        }
                    }
                },
                price: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: 'El valor no es un número',
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        }
                    }
                },
                pvp: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: 'El valor no es un número',
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        }
                    }
                },
                // stock: {
                //     validators: {
                //         notEmpty: {},
                //         numeric: {
                //             message: 'El valor no es un número',
                //             thousandsSeparator: '',
                //             decimalSeparator: '.'
                //         }
                //     }
                // },
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fv.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(form.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            //submit_formdata_with_ajax_form(fv);
            console.log("123456789")
            const category = parseInt(document.querySelector('#id_category').value)
            console.log(category)
            if(category == 1){
                const stock =  document.querySelector('#id_stock').value
                if(stock == ""){
                    alert("Por favor ingresa el stock del producto")
                }else{
                    submit_formdata_with_ajax_form(fv);
                }
                return 
            }
            submit_formdata_with_ajax_form(fv);
        });
});

$(function () {

    select_category = $('select[name="category"]');
    form_group = document.getElementsByClassName('form-group');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es"
    });

    select_category.on('change', function () {
        fv.revalidateField('category');
        fv.revalidateField('name');
        var id = select_category.val();
        if (id === '') {
            return false;
        }

        $.ajax({
            url: pathname,
            data: {
                'action': 'search_category_id',
                'id': id
            },
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType: 'json',
            success: function (request) {
                console.log("qwertt")
                if (!request.hasOwnProperty('error')) {
                    $('.oculto').show();
                    if (!request.inventoried) {
                        $('.oculto').hide();
                    }
                    return false;
                }
                message_error(request.error);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                message_error(errorThrown + ' ' + textStatus);
            }
        });

    });

    $('input[name="price"]')
        .TouchSpin({
            min: 0.01,
            max: 1000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: 'S/.'
        })
        .on('change touchspin.on.min touchspin.on.max', function () {
            $('input[name="pvp"]').trigger("touchspin.updatesettings", {min: parseFloat($(this).val())});
            fv.revalidateField('price');
        })
        .keypress(function (e) {
            return validate_decimals($(this), e);
        });

    $('input[name="pvp"]')
        .TouchSpin({
            min: 0.01,
            max: 1000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: 'S/.'
        })
        .on('change touchspin.on.min touchspin.on.max', function () {
            fv.revalidateField('pvp');
        })
        .keypress(function (e) {
            return validate_decimals($(this), e);
        });
    $('input[name="pvp"]')
        .TouchSpin({
            min: 0.01,
            max: 1000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: 'S/.'
        })
        .on('change touchspin.on.min touchspin.on.max', function () {
            fv.revalidateField('pvp');
        })
        .keypress(function (e) {
            return validate_decimals($(this), e);
        });
    
        $('input[name="stock"]')
        .TouchSpin({
            min: 1,
            max: 1000000,
            step: 1,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
        })
        .on('change touchspin.on.min touchspin.on.max', function () {
            fv.revalidateField('stock');
        })
        .keypress(function (e) {
            return validate_decimals($(this), e);
        });

    if ($('input[name="action"]').val() === 'edit') {
        select_category.trigger('change');
    }
});
