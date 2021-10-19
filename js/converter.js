var Converter = {

    Init: function () {
    },

    Pdf: {

        Load: function (file, callback) {

            PDFJS.getDocument({ url: file }).then(function (pdf) {

                // set pdf info
                Converter.Pdf.DocumentFile = pdf;
                Converter.Pdf.TotalPages = pdf.numPages;
                Converter.Pdf.CurrentPage = 1;

                if (callback !== undefined) {
                    callback('OK', {
                        DocumentFile: pdf,
                        TotalPages: pdf.numPages,
                    });
                }

            }).catch(function (error) {
                callback('Error', error)
            });;
        },

        ShowPage: function (cavas, document, currentPage, callback) {

            document.getPage(currentPage).then(function (page) {

                // as the canvas is of a fixed width we need to set the scale of the viewport accordingly
                var scale_required = cavas.width / page.getViewport(1).width;

                // get viewport of the page at required scale
                var viewport = page.getViewport(scale_required);

                // set canvas height
                cavas.height = viewport.height;

                var renderContext = {
                    canvasContext: cavas.getContext('2d'),
                    viewport: viewport
                };

                // render the page contents in the canvas
                page.render(renderContext).then(function () {

                    // check for callback
                    if (callback !== undefined) {
                        callback();
                    }
                });
            });
        },
    }


}