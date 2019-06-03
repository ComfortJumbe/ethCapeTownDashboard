const USDZAR = 14.06;

const messages = {
  welcome: [
    "Welcome to USSD DAI",
    "1) Create Account",
    "2) Deposit Funds",
    "3) Transfer Funds",
    "4) Check Balance",
    "5) Import Mnemonic (Seed phrase)"
  ].join("<br>")
};

$(function() {
  let balance = 0;
  let state = "init";
  let wallet;
  let recipient;
  let amount;

  $("form").on("submit", function(event) {
    event.preventDefault();

    const input = $("#input").get(0).value;
    $("#input").get(0).value = "";

    if (input === "*123#" && state === "init") {
      $("#display").html(messages.welcome);
      state = "welcome";
    }

    if (state === "welcome" && input === "1") {
      wallet = ethers.Wallet.createRandom();

      $("#display").html(
        [
          "Here is your account:",
          wallet.address,
          "And your seed phrase:",
          "",
          wallet.mnemonic,
          "",
          "Write it down and store it somewhere safe!",
          "0) Back to menu"
        ].join("<br>")
      );
      state = "1-account";
    } else if (state == "1-account" && input == "0") {
      $("#display").html(messages.welcome);
      state = "welcome";
    } else if (state === "welcome" && input === "2") {
      $("#display").html(
        ["Deposit:", "Please Enter the Amount of ZAR Below"].join("<br>")
      );
      state = "deposit";
    } else if (state === "deposit") {
      balance = balance + input / USDZAR;
      $("#display").html(
        [
          "Deposited:",
          "Send the following amount in DAI:",
          input / USDZAR + " (R" + input + ")",
          "To your address:",
          wallet.address,
          "0) Back to menu"
        ].join("<br>")
      );
      state = "deposited";
    } else if (state == "deposited" && input == "0") {
      $("#display").html(messages.welcome);
      state = "welcome";
    } else if (state === "welcome" && input === "3") {
      $("#display").html(
        ["Transfer Funds:", "Enter the phone number of the recipient"].join(
          "<br>"
        )
      );
      state = "withdraw";
    } else if (state === "withdraw") {
      recipient = input;
      $("#display").html(
        ["Transfer Funds:", "Enter the amount of ZAR you want to send:"].join(
          "<br>"
        )
      );
      state = "withdraw-recipient";
    } else if (state === "withdraw-recipient") {
      amount = input;
      $("#display").html(
        [
          "Confirm Transfer Funds:",
          "Do you really want to send",
          "R " + amount + "(" + amount * USDZAR + " DAI)",
          "to: ",
          recipient,
          "",
          "1) Yes",
          "2) Cancel"
        ].join("<br>")
      );
      state = "withdraw-confirm";
    } else if (state === "withdraw-confirm" && input === "1") {
      balance = balance - amount / USDZAR;
      $("#display").html(
        [
          "Funds Transferred:",
          "R " + amount + "(" + amount * USDZAR + " DAI)",
          "to: ",
          recipient,
          "",
          "1) Back to Menu"
        ].join("<br>")
      );
      state = "withdraw-confirmed";
    } else if (state === "withdraw-confirm" && input === "2") {
      $("#display").html(messages.welcome);
      state = "welcome";
    } else if (state === "withdraw-confirmed" && input === "1") {
      $("#display").html(messages.welcome);
      state = "welcome";
    } else if (state === "welcome" && input === "4") {
      $("#display").html(
        [
          "Your balance:",
          "You have " + balance + " DAI",
          "That's R" + balance * USDZAR,
          "",
          "0) Back to Menu"
        ].join("<br>")
      );
      state = "balance";
    } else if (state === "balance") {
      $("#display").html(messages.welcome);
      state = "welcome";
    } else if (state === "welcome" && input === "5") {
      $("#display").html(
        [
          "Import seedphrase:",
          "Type the seedphrase you want to import below"
        ].join("<br>")
      );
      state = "import";
    } else if (state === "import") {
      try {
        wallet = ethers.Wallet.fromMnemonic(input);

        $("#display").html(
          ["Import successful:", wallet.address, "", "0) Back to menu"].join(
            "<br>"
          )
        );
        state = "imported";
      } catch (e) {
        $("#display").html(
          ["Import failed:", e.message, "", "0) Back to menu"].join("<br>")
        );
        state = "imported";
      }
    } else if (state === "imported") {
      $("#display").html(messages.welcome);
      state = "welcome";
    }
  });
});
