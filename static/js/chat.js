 $(document).ready(function (){
            var socket = io.connect();
            var name = "";
            var age = "";
            var gender = "";
            var section = $(".section");
            var new_user = $('#new_user');
            var messageBox = $('#msg');
            var img = $('#picture');
            var footer = $('footer');
            var chatscreen = $('#chatscreen');
            var chats = $('.chats');
            var textarea = $('#msg');
            var onConnect = $(".connected");
            var loginForm = $(".loginForm");
            var yourName = $("#yourName");
            var yourTopic = $("#yourTopic");
            var yourGender = $("#yourGender");
            var show_user = $(".show_user");
            var messageTimeSent = $(".timesent");
            var float_left = $('#float_left');

                
            $('.loginForm').submit(function(e) {
                // if(yourName.val() != '') { 
                    // console.log(yourName.val());
                    var user_info = {};
                    name = yourName.val();
                    gender = yourGender.val();
                    user_info.name = yourName.val();
                    user_info.topic = yourTopic.val();
                    user_info.gender = yourGender.val();      
                    socket.emit('new_user', user_info);
                    yourName.val('');
                    yourTopic.val('');
                    yourGender.val('');
                    e.preventDefault();
                // }
                // else{
                //     prompt("Please enter your name!");
                //     showMessage("connected");
                // }
            });

            socket.on('got_new_user', function(data) {
                 // for(var i=0; i<data.length; i++) {
                    createUserBoard(data.gender, data.name, data.topic);
                // }
               showMessage("chatStarted");
            });
            
            $('#message').submit(function(e) {
                var data = {};
                data.message = messageBox.val();
                data.name = name;
                data.gender = gender;
                socket.emit('new_message', data);
                messageBox.val('');
                e.preventDefault();''
                showMessage("chatStarted");
            });

            socket.on('existing_users', function (data) {
                 // createUserBoard(data.gender, data.name, data.topic);
            });

            socket.on('got_message', function (data) {
                createChatMessage(data.gender, data.name, data.message, moment());
            });

            function createUserBoard(gender, name, topic) {
                if(gender === 'female') {
                var li = $(
                    '<li class="all_users">' +
                    '<div id="boardPicture">' +
                        '<img src="../img/female.png" id="creatorImage"/>' +
                        '<b></b>' +
                        '<p></p>' + 
                    '</div>' +
                    '</li>');
                }
                else {
                    var li = $(
                    '<li class="all_users">' +
                    '<div id="boardPicture">' +
                        '<img src="../img/male.png" class="img-thumbnail" id="creatorImage"/>' +
                        '<b></b>' +
                        '<p></p>' +
                    '</div>' +
                    '</li>');
                }
                li.find('p').text('Topic: ' + topic);
                li.find('b').text(name);
                show_user.append(li);
                new_user.css('display', 'inline-block');
            };

            function createChatMessage(gender, user, message_box, time_now) {
                var who = '';
                if(user===name) {
                    who = 'me';
                    console.log(who);
                }
                else {
                    who = 'you';
                    console.log(who);
                }
                if(gender === 'female') {
                    var li = $(
                        '<li class=' + who + '>' +
                        '<div class="chatPicture">' + 
                        '<img src="../img/female.png"/>' +
                        '<b></b>' + 
                        '<i class="timesent" data-time=' + time_now + '></i> ' +
                        '</div>' + 
                        '<p></p>' +
                        '</li>');
                }
                else {
                    var li = $(
                        '<li class=' + who + '>' +
                        '<div class="chatPicture">' + 
                        '<img src="../img/male.png" class="img-thumbnail"/>' +
                        '<b></b>' + 
                        '<i class="timesent" data-time=' + time_now + '></i> ' +
                        '</div>' + 
                        '<p></p>' +
                        '</li>');
                }
                li.find('p').text(message_box);
                li.find('b').text(user);

                chats.append(li);
                messageTimeSent = $(".timesent");
                messageTimeSent.last().text(time_now.fromNow());    
            };

            setInterval(function(){
                messageTimeSent.each(function(){
                 var each = moment($(this).data('time'));
                $(this).text(each.fromNow());
             });
             },60000);

            function showMessage(status,data){ 
                if(status === "connected"){
                    section.children().css('display', 'inline-block');
                }
                else if(status === "chatStarted"){
                    onConnect.fadeOut(1200, function() {
                        new_user.fadeIn(1200);
                        footer.fadeIn(1200);
                        chatscreen.fadeIn(1200);
                        float_left.fadeIn(1200);
                        chatscreen.css('display', 'inline-block');
                    });
                };
            };    

            function scrollToBottom(){
             $("html, body").animate({ scrollTop: $(document).height()-$(window).height() },1000);
            };
        });