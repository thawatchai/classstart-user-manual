var casper = require('casper').create();

casper.echoUrl = function() {
  this.echo(this.getCurrentUrl(), 'COMMENT');
};

casper.start("http://www.usableclass.dev");

//----------------------------------------------------------------

function User(email, password) {
  this.email = email;
  this.password = password;

  // SIGN IN
  this.sign_in = function() {
    casper.then(function() {
      casper.echo(email + ' is signing in...', 'INFO_BAR');
      this.echoUrl();

      if (this.exists('a[href="/users/sign_in"]')) {
        this.echo("found the sign_in link");
      } else {
        this.die("cannot find the sign_in link");
      }
      this.click('a[href="/users/sign_in"]');
      this.capture('images/users_sign_in.png', {top: 0, left: 0, width: 980, height: 40});
      this.echo("clicked the sign_in link");
    });

    casper.then(function() {
      this.captureSelector('images/users_sign_in_form.png', '.content');
    });

    casper.then(function() {
      this.echoUrl();

      this.fill('form#new_user', {
        'user[email]': email,
        'user[password]': password
      }, true);
      this.echo("filled the new_user form");
    });

    casper.then(function() {
      this.echoUrl();

      if (this.exists('a[href="/users/sign_out"]')) {
        this.echo("sign_in succeeded", 'INFO');
      } else {
        this.echo(this.fetchText('.body'));
        this.echo("sign_in failed", 'ERROR');
      }
    });
  };

  // SIGN OUT
  this.sign_out = function() {

    casper.then(function() {
      casper.echo(email + ' is signing out...', 'INFO_BAR');
      this.echoUrl();

      if (this.exists('a[href="/users/sign_out"]')) {
        this.echo("found the sign_out link");
      } else {
        this.die("cannot find the sign_out link");
      }
      this.click('a[href="/users/sign_out"]');
      this.capture('images/users_sign_out.png', {top: 0, left: 0, width: 980, height: 40});
      this.echo("clicked the sign_out link");
    });

    casper.then(function() {
      if (this.exists('a[href="/users/sign_in"]')) {
        this.echo("sign_out succeeded", 'INFO');
      }
    });
  };
}

//----------------------------------------------------------------

var user1 = new User('user1@example.com', 'password');
user1.sign_in();
user1.sign_out();

casper.run();
