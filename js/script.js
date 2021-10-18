var Main = {

    Init: function () {

        window.onload = function () {
            Main.Pdf.Reset();
            Main.Pdf.Bind();
        }
    }(),


    Pdf: {

        DocumentFile: null,
        TotalPages: null,
        CurrentPage: null,

        Reset: function () {
            $('#upload-button').fadeIn();
            $('#download-image').fadeOut();
            $('#new-upload').fadeOut();
            $('#pdf-container').fadeOut();
        },

        Bind: function () {

            var canvas = $('#pdf-canvas')[0];

            // bind upload button
            $("#upload-button").on('click', function () {
                $("#file-to-upload").trigger('click');
            });

            // when user chooses a PDF file
            $("#file-to-upload").on('change', function () {

                // get current file
                var file = $("#file-to-upload")[0].files[0];

                $("#file-to-upload").val('');

                // validate whether PDF
                if (['application/pdf'].indexOf(file.type) == -1) {
                    alert('Error : Not a PDF');
                    return;
                }

                // hide upload button
                $("#upload-button").hide();

                // send the object url of the pdf
                var fileBlob = URL.createObjectURL(file);

                Converter.Pdf.Load(fileBlob, function (status, result) {

                    if (status === 'OK') {
                        var cavas = $('#pdf-canvas')[0];
                        Main.Pdf.DocumentFile = result.DocumentFile;
                        Main.Pdf.TotalPages = result.TotalPages;
                        Main.Pdf.CurrentPage = 1;

                        // show page in canvas
                        Converter.Pdf.ShowPage(cavas, Main.Pdf.DocumentFile, Main.Pdf.CurrentPage, function () {
                            $('#download-image').fadeIn();
                            $('#new-upload').fadeIn();
                            $('#pdf-container').fadeIn();
                        });
                    }

                });

            });

            // download button
            $("#download-image").on('click', function () {
                $(this).attr('href', canvas.toDataURL()).attr('download', 'page.png');
            });

            // download button
            $("#new-upload").on('click', function () {
                Main.Pdf.Reset();
            });
        },

    }
}