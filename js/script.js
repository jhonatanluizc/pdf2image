var Main = {

    Init: function () {

        window.onload = function () {
            Main.Pdf.Render.Reset();
            Main.Pdf.Bind();
        }
    }(),

    Pdf: {

        DocumentFile: null,
        TotalPages: null,
        CurrentPage: null,

        Render: {

            Reset: function () {
                $('#upload-button').fadeIn();
                $('#download-image').fadeOut();
                $('#new-upload').fadeOut();
                $('#pdf-container').fadeOut();
                $('#page-previous').fadeOut();
                $('#page-next').fadeOut();
                $('#page-info').fadeOut();
            },

            Loaded: function () {
                $('#download-image').fadeIn();
                $('#new-upload').fadeIn();
                $('#pdf-container').fadeIn();
                $('#page-previous').fadeIn();
                $('#page-next').fadeIn();
                $('#page-info').fadeIn();
            },

            Info: function () {
                $("#page-info").text(`Page ${Main.Pdf.CurrentPage} / ${Main.Pdf.TotalPages}`);
            }
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
                var PdfBlob = URL.createObjectURL(file);

                /// :: load pdf
                Main.Pdf.Load(PdfBlob);

            });

            // download button
            $("#download-image").on('click', function () {
                $(this).attr('href', canvas.toDataURL()).attr('download', 'page-' + Main.Pdf.CurrentPage + '.png');
            });

            // reset 
            $("#new-upload").on('click', function () {
                Main.Pdf.Render.Reset();
            });

            // previous page
            $("#page-previous").on('click', function () {
                Main.Pdf.Previous();
            });

            // next page
            $("#page-next").on('click', function () {
                Main.Pdf.Next();
            });

        },

        Load: function (pdfBlob) {

            Converter.Pdf.Load(pdfBlob, function (status, result) {

                if (status === 'OK') {
                    Main.Pdf.DocumentFile = result.DocumentFile;
                    Main.Pdf.TotalPages = result.TotalPages;
                    Main.Pdf.CurrentPage = 1;
                    Main.Pdf.GoToPage(Main.Pdf.CurrentPage);
                }
            });
        },
        GoToPage: function (pageNumber) {

            // base
            var canvas = $('#pdf-canvas')[0];

            // show page in canvas
            Converter.Pdf.ShowPage(canvas, Main.Pdf.DocumentFile, pageNumber, function () {
                Main.Pdf.Render.Loaded();
                Main.Pdf.Render.Info();
            });

        },
        Previous: function () {
            if (Main.Pdf.CurrentPage > 1)
                Main.Pdf.GoToPage(--Main.Pdf.CurrentPage);
        },
        Next: function () {
            if (Main.Pdf.TotalPages > Main.Pdf.CurrentPage)
                Main.Pdf.GoToPage(++Main.Pdf.CurrentPage);
        },

    }
}