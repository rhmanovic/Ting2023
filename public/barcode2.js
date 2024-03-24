doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Inventory Management
    link(rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css")
    link(rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css")
    style.
      @media (max-width: 380px) {
        .container {
          padding: 0 5px;
        }
        .form-control, .btn {
          font-size: 12px;
        }
      }

      #videoContainer {
          position: relative;
          width: 100%;
          max-width: 400px;
      }

      #videoElement {
          width: 100%;
          height: auto;
      }

      #result {
          margin-top: 20px;
          padding: 10px;
          width: 100%;
          border: 1px solid #ccc;
      }

      #detectionArea {
          position: absolute;
          border: 2px solid red;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%; /* Adjust the width of the detection area */
          aspect-ratio: 1 / 1;
          pointer-events: none; /* Ensure the detection area doesn't intercept clicks */
          z-index: 1; /* Ensure the detection area is above the video */
      }

  body
    
    .container.my-4
      h1.text-center.mb-4 ماسح الباركود


      form(id="barcodeForm" class="mb-3")
        .row.justify-content-center
          input(type="", id="barcodeId", name="barcodeId", class="form-control", placeholder="Enter barcode")

          button.col-6.btn.btn-outline-primary#scanButton(type="submit")
            i.fas.fa-barcode.fa-2x

      hr
      h2.text-center.mb-3 فاتورة

      .table-responsive
        table.table.table-hover#inventoryTable
          thead
            tr
              th الاسم
              th الكمية
              th السعر
              th الاجمالي
          tbody
          tfoot
            tr
              td الخصم:
              td <input type="number" id="discount" value="0" class="form-control" placeholder="Enter discount"></td>
              td
            tr
              td الشحن:
              td <input type="number" id="deliveryFee" value="0" class="form-control" placeholder="Enter delivery fee"></td>
              td
            tr
              td
              td
              td
                span الاجمالي:

              td#totalPrice 0


    .row.mt-3.mb-3.justify-content-center
      .col-auto
        input#mobile1(type="text", name="mobile", class="form-control", placeholder="رقم الهاتف")
    .row.mt-3.mb-3.justify-content-center
      
      .col-auto
        button#postDataBtn.btn.btn-primary.btn-lg انشئ الفاتورة



    
    

    .modal.fade#productModal(tabindex='-1', role='dialog', aria-labelledby='productModalLabel', aria-hidden='true', show='true')
      .modal-dialog.modal-dialog-centered
        .modal-content
          .modal-body
            p#modalData
            

          .modal-footer
            button#closeModalBtn.btn.btn-secondary(type='button', data-bs-dismiss='modal') Close

    #qrModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='qrModalLabel', aria-hidden='true')
      .modal-dialog.modal-dialog-centered
        .modal-content
          .modal-body
            #videoContainer
              video#videoElement(autoplay, playsinline)
              div#detectionArea

          .modal-footer
            button#closeModalBtn.btn.btn-secondary(type='button', data-bs-dismiss='modal') Close


    // Confirmation Modal
    .modal.fade#confirmationModal(tabindex="-1", role="dialog", aria-labelledby="confirmationModalLabel", aria-hidden="true")
      .modal-dialog(role="document")
        .modal-content
          .modal-header
            h5#confirmationModalLabel.modal-title Confirmation
            button.close(type="button", data-bs-dismiss="modal", aria-label="Close")
              span(aria-hidden="true") ×
          .modal-body
            p Are you sure you want to delete this row?
          .modal-footer
            button.btn.btn-secondary(type="button", data-bs-dismiss="modal") Cancel
            button.btn.btn-danger#confirmDelete(type="button") Delete

    script(src="https://code.jquery.com/jquery-3.6.0.min.js")
    script(src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js")
    script(src="/barcode22.js") // Link to the external JavaScript file
    script(src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.min.js")
    script(src="/barcode2.js") // Link to the external JavaScript file
