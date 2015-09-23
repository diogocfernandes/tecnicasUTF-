
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
    autoHideAfter: 0,
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
        account.name = accountModel.name;
        account.surname = accountModel.surname;
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
