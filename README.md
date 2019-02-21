# BS4 DataTables for Vue
DataTable components, inpired in https://datatables.net/, and styled with Bootstrap 4 classes and Font-Awesome.

### Props
| Prop        | Required/Mandatory | Description           |
| ------------- |:-------------:| -------- |
| :columns      | YES | Array of column definition objects. |
| :data      | optional      | Your data: an array of single or complex objects. If not set, then you MUST provide the AJAX prop. |
| :ajax | optional      | Feed the datatable from a remote datasource/API. Useful when you are dealing with more than a thousand rows |

### Column Definition Objects (:columns)
( still working on it )

### Column Actions
It's very common to have tables/lists with an "actions" column, on which you may perform several actions on the object listed (such as edit, delete, etc). You can easily turn a column into an "Actions" column by simply providing an array of "Action Definition Objects":

```javascript
{
    ...
    columns : [
        { ... },
        { ... },
        {
            actions : [
                {
                    icon : "edit",
                    attr : {
                        dataToggle : "modal",
                        dataTarget : "my-modal"
                    }
                },
                {
                    icon : "trash",
                    attr : {
                        href : function(row){
                            return `/post/delete/${row.id}`;
                        }
                    }
                }
            ]
        }
    ]
}
```

Below is the list of available field for an Action Definition Object:

| Field | Type | Default |  Required/Mandatory | Description |
| ----- | ---- | ------- | ----------- | --------------------|
| visible | bool | true | no | Sets whether the action is visible or not. | 
| icon | string | null | yes | The name of a font-awesome icon (the suffix of the fontawesome CSS class. examples: "edit", "coffe")
| attr | object | null | no | An object of HTML attributes you wish to add to the action button. The keys of this attributes object can be camelCased, and the value to the key can be of any type, even a function, in which case this function will be called with one parameter: your data object for the row that is being rendered. |

