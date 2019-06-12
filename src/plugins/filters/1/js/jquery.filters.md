#jquery.filters.js

##Checkboxes

    @@include('_tpl_products-filters-element.html', {
      "addClass": "",
      "hasImg": "",
      "hasIcon": "",
      "keepTagFromLabel": "true",
      "checkboxes": {
        "white": {
          "labelText": "Белый цвет (label)",
          "tagText": "Белый (tag)",
          "img": "",
          "icon": ""
        },
        "black": {
          "labelText": "Черный цвет (label)",
          "tagText": "Черный (tag)",
          "img": "",
          "icon": ""
        }
      }
    })
    
* "keepTagFromLabel": "true" - Если "true", то текст тега берется с названия чекбокса, если "", то текст берется с отдельного атрибута