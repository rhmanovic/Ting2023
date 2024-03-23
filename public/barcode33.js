$(document).ready(function() {
  // Automatically focus the cursor on the barcodeId input field when the page loads
  $('#barcodeId').focus();

  function calculateRowTotal(row) {
    const quantity = $(row).find('.quantity-input').val() || 0;
    const price = $(row).find('.price-input').val() || 0;
    return quantity * price;
  }

  function updateTotalPrice() {
    let subtotal = 0;
    $('#inventoryTable tbody tr').each(function() {
      const total = calculateRowTotal(this);
      subtotal += total;
      $(this).find('.total').text(total.toFixed(2));
    });

    const deliveryFee = parseFloat($('#deliveryFee').val()) || 0;
    const discount = parseFloat($('#discount').val()) || 0;
    const totalPrice = subtotal + deliveryFee - discount;
    $('#totalPrice').text(totalPrice.toFixed(2));
  }

  $('#barcodeId').on('input', function() {
    $('#barcodeForm').submit();
  });

  $('#barcodeForm').submit(function(e) {
    e.preventDefault();
    const barcodeId = $('#barcodeId').val();

    // Example AJAX call
    $.ajax({
      type: 'POST',
      url: '/manager/fetchProduct', // Ensure this URL matches your actual endpoint
      data: { barcodeId: barcodeId },
      success: function(response) {
        // Assuming response structure is { productName: "Example Product", quantity: 1, price: 100 }
        // Make sure the property names here match what's being returned from your server
        const productNameA = response[0].productNameA; // Ensure this matches the property name in your response
        const nameA = response.nameA; // Ensure this matches the property name in your response
        const inventoryID = response._id; // Ensure this matches the property name in your response
        const quantity = response.quantity || 1; // Default to 1 if undefined
        const price = response.price || 0; // Default to 0 if undefined
        const total = quantity * price;

        const uniqueId = Date.now(); // Generate a unique ID based on the current timestamp
        const tableRow = $(``);
        const modalData = `<h1>${productNameA}</h1><table class=\"table\">${Object.entries(response).map(([key, value]) =>
          `<tr style=\"background-color: ${value.nameA.includes('3500') ? 'yellow' : value.nameA.includes('4000') ? '#FEF3BD' : 'none'};\"><td>${value.brand}</td><td>${value.nameA}</td><td>${value.quantitywarehouse01}</td><td>


            <form class=\"modalForm\">
              <input type=\"hidden\" name=\"productId\" value=\"${value._id}\">
              <button type=\"submit\" class=\"btn btn-secondary\">Submit</button>
            </form>
          </td></tr>`
        ).join('')}</table>`;


        $('#productModal').modal('show');
        $('#inventoryTable tbody').append(tableRow);



        // Clear the modal data before appending new data
        $('#modalData').empty();

        // Append modal data dynamically
        // Change the text of the paragraph within the modal
        $('#modalData').append(modalData);



        // Update totals and attach event listeners as necessary
        updateTotalPrice();

        // Clear the content of the barcodeId input field and focus on it
        $('#barcodeId').val('').focus();
      },
      error: function(err) {
        console.error('Error fetching inventory item:', err);
        // Handle error
      }
    });
  });





  $(document).on('submit', '.modalForm', function(e) {
    e.preventDefault();
    console.log('Modal form submitted');

    console.log('Included input:', $(this).serialize());

      const barcodeId = $(this).serialize().split('=')[1];

      // Example AJAX call
      $.ajax({
        type: 'POST',
        url: '/manager/fetchInventory', // Ensure this URL matches your actual endpoint
        data: { barcodeId: barcodeId },
        success: function(response) {
          // Assuming response structure is { productName: "Example Product", quantity: 1, price: 100 }
          // Make sure the property names here match what's being returned from your server
          const productNameA = response.productNameA; // Ensure this matches the property name in your response
          const nameA = response.nameA; // Ensure this matches the property name in your response
          const inventoryID = response._id; // Ensure this matches the property name in your response
          const quantity = response.quantity || 1; // Default to 1 if undefined
          const price = response.price || 0; // Default to 0 if undefined
          const total = quantity * price;

          const uniqueId = Date.now(); // Generate a unique ID based on the current timestamp
          const tableRow = $(`<tr id="tr${uniqueId}">
            <td><span>${productNameA}</span><br><span>${nameA}</span></td>
            <td><span>${response.brand}</span></td>
            <td><input type="number" value="${quantity}" class="form-control quantity-input"></td>

            <td>

              <button class="btn btn-danger delete-row" data-id="${uniqueId}">Delete</button>
            </td>
            <td style="display:none;"><input type="hidden" name="inventoryID" value="${inventoryID}"></td>
            <td style="display:none;"><input type="hidden" name="productNameE" value="${response.productNameE}"></td>
            <td style="display:none;"><input type="hidden" name="productNameAs" value="${response.productNameA}"></td>
            <td style="display:none;"><input type="hidden" name="nameAs" value="${response.nameA}"></td>
            <td style="display:none;"><input type="hidden" name="nameEs" value="${response.nameE}"></td>
            <td style="display:none;"><input type="hidden" name="inventoryCosts" value="${response.cost}"></td>
            <td style="display:none;"><input type="hidden" name="warranty" value="${response.warranty}"></td>
            <td style="display:none;"><input type="hidden" name="brand" value="${response.brand}"></td>
            <td style="display:none;"><input type="hidden" name="brand" value="${response.brand}"></td>
            <td style="display:none;"><input type="number" value="${price}" class="form-control price-input" name="price"></td>

          </tr>`);

          $('#inventoryTable tbody').append(tableRow);

          // Update totals and attach event listeners as necessary
          updateTotalPrice();

          // Clear the content of the barcodeId input field and focus on it
          $('#barcodeId').val('').focus();


        // Hide the modal after successful data processing
        $('#productModal').modal('hide');

        },
        error: function(err) {
          console.error('Error fetching inventory item:', err);
          // Handle error
        }
      });
    });

    // Recalculate the total price when delivery fee or discount changes
    $('#deliveryFee, #discount').on('input', updateTotalPrice);

    // Event delegation to handle dynamically added input fields
    $(document).on('input', '.quantity-input, .price-input', function() {
      const row = $(this).closest('tr');
      const total = calculateRowTotal(row);
      row.find('.total').text(total.toFixed(2));

      // Update the total price for all items
      updateTotalPrice();
    });



  // Recalculate the total price when delivery fee or discount changes
  $('#deliveryFee, #discount').on('input', updateTotalPrice);

  // Event delegation to handle dynamically added input fields
  $(document).on('input', '.quantity-input, .price-input', function() {
    const row = $(this).closest('tr');
    const total = calculateRowTotal(row);
    row.find('.total').text(total.toFixed(2));

    // Update the total price for all items
    updateTotalPrice();
  });

  $('#logDataBtn').click(function() {
    let tableData = [];
    $('#inventoryTable tbody tr').each(function() {
      const inventoryID = $(this).find('input[name="inventoryID"]').val(); // Retrieve inventoryID
      const productName = $(this).find('input[name="productNameAs"]').val();

      const nameAs = $(this).find('input[name="nameAs"]').val();
      const nameEs = $(this).find('input[name="nameEs"]').val();
      const productNameE = $(this).find('input[name="productNameE"]').val();
      const inventoryCosts = $(this).find('input[name="inventoryCosts"]').val();
      const warranty = $(this).find('input[name="warranty"]').val();
      const brand = $(this).find('input[name="brand"]').val();
      const quantity = parseFloat($(this).find('.quantity-input').val());
      const price = parseFloat($(this).find('.price-input').val());
      const total = parseFloat($(this).find('.total').text());








      tableData.push({ inventoryID, productName, productNameE, inventoryCosts, warranty, brand, quantity, total, nameAs, nameEs, price });
    });

    const discount = parseFloat($('#discount').val()) || 0;
    const deliveryFee = parseFloat($('#deliveryFee').val()) || 0;
    const grandTotal = tableData.reduce((acc, item) => acc + item.total, 0) + deliveryFee - discount;

    const mobile = $(`#mobile1`).val();


    // Consolidate all data into one JSON object
    const consolidatedData = {
      tableData,
      discount,
      deliveryFee,
      grandTotal,
      mobile
    };

    // Log the consolidated JSON object
    console.log(JSON.stringify(consolidatedData, null, 2)); // Beautify the JSON output
  });

  $('#postDataBtn').click(function() {
    let postData = {
      tableData: [],
      discount: parseFloat($('#discount').val()) || 0,
      deliveryFee: parseFloat($('#deliveryFee').val()) || 0,
      mobile: $(`#mobile1`).val() || 0
    };


    // Iterate through each row of the table and collect the data
    $('#inventoryTable tbody tr').each(function() {
      const inventoryID = $(this).find('input[name="inventoryID"]').val(); // Retrieve inventoryID
      const productName = $(this).find('input[name="productNameAs"]').val();
      const nameAs = $(this).find('input[name="nameAs"]').val();
      const nameEs = $(this).find('input[name="nameEs"]').val();
      const productNameE = $(this).find('input[name="productNameE"]').val();
      const inventoryCosts = $(this).find('input[name="inventoryCosts"]').val();
      const warranty = $(this).find('input[name="warranty"]').val();
      const brand = $(this).find('input[name="brand"]').val();
      const quantity = parseFloat($(this).find('.quantity-input').val());
      const price = parseFloat($(this).find('.price-input').val());
      const total = parseFloat($(this).find('.total').text());

      postData.tableData.push({ inventoryID, productName, productNameE, inventoryCosts, warranty, brand, quantity, total, nameAs, nameEs, price });
    });




    // Send the collected data to the server
    $.ajax({
      type: 'POST',
      url: '/manager/postDataBarcode', // Update this URL with your actual endpoint
      data: JSON.stringify(postData),
      contentType: 'application/json',
      success: function(response) {
        console.log('Data successfully posted:', response);
        // Handle success

        window.location.href = '/manager/orderPage/' + response.orderId;
      },
      error: function(err) {
        console.error('Error posting data:', err);
        // Handle error
      }
    });


  });

  $('#postDataBtnTransfer').click(function() {
    let postData = {
      tableData: [],
      sendFrom: $(`#sendFrom`).val() || 0
    };


    // Iterate through each row of the table and collect the data
    $('#inventoryTable tbody tr').each(function() {
      const inventoryID = $(this).find('input[name="inventoryID"]').val(); // Retrieve inventoryID
      const productName = $(this).find('input[name="productNameAs"]').val();
      const nameAs = $(this).find('input[name="nameAs"]').val();
      const nameEs = $(this).find('input[name="nameEs"]').val();
      const productNameE = $(this).find('input[name="productNameE"]').val();


      const brand = $(this).find('input[name="brand"]').val();
      const quantity = parseFloat($(this).find('.quantity-input').val());



      postData.tableData.push({ inventoryID, productName, productNameE, brand, quantity, nameAs, nameEs });
    });




    // Send the collected data to the server
    $.ajax({
      type: 'POST',
      url: '/manager/postDataBtnTransfer', // Update this URL with your actual endpoint
      data: JSON.stringify(postData),
      contentType: 'application/json',
      success: function(response) {
        console.log('Data successfully posted:', response);
        // Handle success

        window.location.href = '/manager/transferRequest';
      },
      error: function(err) {
        console.error('Error posting data:', err);
        // Handle error
      }
    });


  });





  // Event listener for dynamically added delete buttons
  $(document).on('click', '.delete-row', function() {
    const rowId = $(this).data('id');
    const rowToDelete = $(`#tr${rowId}`);

    // Show confirmation modal

    $('#confirmationModal').modal('show');

    // Event listener for confirm delete button
    $('#confirmDelete').off().click(function() {
      rowToDelete.remove(); // Remove the row from the table
      updateTotalPrice(); // Update the total price after removing the row
      $('#confirmationModal').modal('hide'); // Hide the confirmation modal
    });
  });
});
