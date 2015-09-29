
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        deviceReady = true;
        console.log("Device Ready!");


    }
};
app.initialize();

if (!localStorage.accountId){
    localStorage.setItem('accountId',0);
}

var savedAccounts;

var kendoApp = new kendo.mobile.Application($(document.body), {skin: "nova" });


var notification = $("#notification").kendoNotification({
    position: {
        pinned: true,
        top: 30,
        right: 30
    },
    autoHideAfter: 10,
    stacking: "down",
    templates: [{
        type: "upload-success",
        template: $("#successTemplate").html()
    }]

}).data("kendoNotification");



var accountModel = kendo.observable({
    name:"",
    surname:"",
    accountNumber:"",
    accountAny:"",
    limitValue: "",
    accountType:"",

    limitOnChange:function(e){

        $("#SlimitValue").text("R$ " + e.value);
        accountModel.limitValue= e.value;


    },
   accountTypeOnChange:function(e){
       console.log(e.data.accountType);
       var accountType=e.data.accountType;

       if(accountType == "CCL"){
           $("#limitSlider").data("kendoSlider").enable();
           document.getElementById("date").disabled = true;
       }
       if(accountType == "CC"){
           $("#limitSlider").data("kendoSlider").disable();
           $("#SlimitValue").text("");
           document.getElementById("date").disabled = true;
       }
       if(accountType == "PO"){
           $("#limitSlider").data("kendoSlider").disable();
           $("#SlimitValue").text("");
           document.getElementById("date").disabled = false;
       }

   },
    afterShow:function(e){

        $("#limitSlider").kendoSlider({
            change: this.limitOnChange,
            min: 1000,
            max: 10000,
            smallStep: 100,
            largeStep: 1000,
            value: accountModel.limitValue
        });
        $("#limitSlider").data("kendoSlider").disable();
        document.getElementById("date").disabled = true;



    },
    save:function(e){
        var account = {};
        account.name = accountModel.name + " " + accountModel.surname;
        account.accountNumber = accountModel.accountNumber;
        account.accountAny = accountModel.accountAny;
        account.limitValue = accountModel.limitValue;
        account.accountType = accountModel.accountType;
        account.id = localStorage.accountId++;




        var savedAccounts = localStorage.getItem("savedAccounts");
        if (savedAccounts == null) {
            savedAccounts=[];
        } else {
            savedAccounts = JSON.parse(savedAccounts);
            if (savedAccounts == null) {
                savedAccounts = [];
            }
        }
        savedAccounts.push(account);



        localStorage.setItem("savedAccounts", JSON.stringify(savedAccounts));
        notification.show({
            message: "Salvo!"
        }, "upload-success");
        loadAccounts();
    }
});

function loadAccounts(){
    savedAccounts = localStorage.getItem("savedAccounts");
    if (savedAccounts == null) {
        savedAccounts=[];
    } else {
        savedAccounts = JSON.parse(savedAccounts);
        if (savedAccounts == null) {
            savedAccounts = [];
        }
    }
}

function loadEntrys(){
    var accountEntry = localStorage.getItem("accountEntry");
    if (accountEntry == null) {
        accountEntry=[];
    } else {
        accountEntry = JSON.parse(accountEntry);
        if (accountEntry == null) {
            accountEntry = [];
        }
    }
    return accountEntry;
}

var entryModel = kendo.observable({
    entryType:"",
    entryValue:"",
    entryAccount:"",
    entryAccountId:"",

    afterShow:function(e){
        loadAccounts();


        //create AutoComplete UI component
        $("#nomeConsulta").kendoAutoComplete({
            template: '<span class="order-id">#= name #</span> |     #= id #',
            dataSource: savedAccounts,
            dataTextField: "name",
            filter: "startswith",
            placeholder: "",
            select: function(e) {
                var dataItem = this.dataItem(e.item.index());

                entryModel.entryAccountId = dataItem.id;
            }
        });

    },
    save:function(e){
        var entry = {};
        entry.type = entryModel.entryType;
        entry.accountId = entryModel.entryAccountId;
        entry.value = entryModel.entryValue;


        var accountEntry = localStorage.getItem("accountEntry");
        if (accountEntry == null) {
            accountEntry=[];
        } else {
            accountEntry = JSON.parse(accountEntry);
            if (accountEntry == null) {
                accountEntry = [];
            }
        }
        accountEntry.push(entry);



        localStorage.setItem("accountEntry", JSON.stringify(accountEntry));
        notification.show({
            message: "Salvo!"
        }, "upload-success");

    }
});

var statementModel = kendo.observable({
    statementAccount:"",
    statementAccountId:"",
    statementDataSource: new kendo.data.DataSource({
        data: [],
        sort: {dir: "desc", field: "createdAt"}
    }),

    afterShow:function(e){
        loadAccounts();

        //create AutoComplete UI component
        $("#nomeStatement").kendoAutoComplete({
            template: '<span class="order-id">#= name #</span> |     #= id #',
            dataSource: savedAccounts,
            dataTextField: "name",
            filter: "startswith",
            placeholder: "",
            select: function(e) {
                var dataItem = this.dataItem(e.item.index());

                statementModel.statementAccountId = dataItem.id;
            }
        });

    },
    search:function(e){
        var entryFull, entry = [];
        entryFull = loadEntrys();
        var size = entryFull.length;
        for (var i = 0;i < size ;i ++){
            var thisEntry = entryFull[i];
            if (thisEntry.accountId == statementModel.statementAccountId ){
                entry.push(thisEntry);
            }
        }
        statementModel.statementDataSource.data(entry);


    }
});

function saveMethod (e){
    console.log(e);
}

