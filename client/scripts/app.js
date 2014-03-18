var app = window.app;
app = {};

app.init = function(){
  app.server = 'http://127.0.0.1:3000/classes/';
  app.url = decodeURI(document.URL);
  app.username = (app.url.slice(app.url.indexOf('=') + 1)).toString();
  app.roomName = undefined;
  app.rooms = {};
  app.friends = {};

  app.sendHandler();
  app.dropdownHandler();
  app.friendHandler();
  app.fetch(app.roomName);
  app.roomChecker();
  setInterval(function(){
    app.fetch(app.roomName);
  }, 1000);
  setInterval(function(){
    app.roomChecker();
  }, 5000);
};

app.fetch = function(roomName) {
  $.ajax({
    url: app.server,
    // data: {order: '-createdAt'},
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      data = JSON.parse(data);
      console.log(data, data.results);
      var messages = data.results;
      $('.messageContainer li').remove();
      for(var i = 0; i < messages.length; i++){
        if(!roomName){
          app.addMessage(messages[i]);
        }else if(messages[i].roomname === roomName){
          app.addMessage(messages[i]);
        }
      }
    },
    error: function (data) {
      // console.log(data);
      console.error('chatterbox: Failed to retrieve message');
    }
  });
};

app.addMessage = function(message){
  $('.messageContainer').append('<li class="message"></li>');
  $('.message').filter(':last').text(' [' + message.roomname + '] ' + ': ' + message.text);
  $('.message').filter(':last').prepend('<a class="userName" href="">' + message.username + '</a>');
  if (app.friends[message.username]) {
    $('.userName').filter(':last').addClass('friend');
  }
};

app.send = function (messageObj) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(messageObj),
    // data: messageObj,
    contentType: 'application/json',
    success: function (data) {},
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.addFriend = function(newFriend) {
  app.friends[newFriend] = true;
};

app.roomChecker = function(){
  $.ajax({
    url: app.server,
    // data: {order: '-createdAt'},
    type: 'GET',
    contentType: 'jsonp',
    success: function (data) {
      var messages = data.results;
      app.rooms = {};
      _.each(messages, function(item){
        app.rooms[item.roomname] = true;
      });
      app.populateDropdown();
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message');
    }
  });
};

app.populateDropdown = function() {
  $('.roomOption').val('');
  _.each(app.rooms, function(value, key){
    $('.rooms').append('<option class="roomOption" value="' + key + '">');
  });
};

app.dropdownHandler = function(){
  $('.roomParent').on('input', function(){
    if ($(this).val() === '') {
      app.roomName = undefined;
    } else {
      app.roomName = $(this).val();
    }

  });
};

app.sendHandler = function () {
  $('.inputButton').on('click', function() {
    var messageText = $('.chatInput').val();
    var messageObj = {
      username: app.username,
      text: messageText,
      roomname: app.roomName
    };
    app.send(messageObj);
    $('.chatInput').val('').focus();
  });
};

app.friendHandler = function() {
  $('.messageContainer').on('click', '.userName', function(event) {
    event.preventDefault();
    app.addFriend($(this)[0].text);
  });
};

$('document').ready(function() {
  app.init();
});
