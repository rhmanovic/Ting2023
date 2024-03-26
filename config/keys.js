extends layout

block content
  .main.container
    h1 Categories Page


    .row
        h3 Posts Data

       

        table.table
          thead
            tr
              th(scope='col') price
              th(scope='col') discountPrice
              th(scope='col') img
              th(scope='col') ItemNo
              th(scope='col') warranty
              th(scope='col') name
              th(scope='col') disc
              
          tbody
            each product,index in productData
              tr
                if product.img[0]
                  - var cx = product.img[0]
                  
                  td= product.price.toFixed(3)+" K.D"
                  td= product.discountPrice.toFixed(3)+" K.D"
                  td
                    a(href=`${product.img[0]}`)
                      span= "/Users/abdulrahmanaldhuferi/Desktop/ITC/posts/img/" + cx.split("/")[3]
                  td= product.productNo
                  if product.warranty > 0
                    td= "الكفالة: " + product.warranty + " سنة"
                  else
                    td -
                  td
                    span= product.name
                  td
                    span= product.name
                    br
                    if product.discounted
                      span= "قبل الخصم: " + product.price.toFixed(3) + " د.ك"
                      br
                      span= "بعد الخصم: " + product.discountPrice.toFixed(3) + " د.ك"
                    else
                      span= "السعر: " + product.price.toFixed(3) + " د.ك"
                    br
                    br
                    span= product.nameE
                    br
                    br
                    span= "رقم البحث في المتجر: " + product.productNo
                    br
                    span= "او حياك خدمه العملاء رسائل الواتساب"

                 

               
