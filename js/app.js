/*
 * 创建一个包含所有卡片的数组
 */
let cardarray = [];
$('.deck').find('li').find('i').each(function(index) {
  cardarray[index] = $(this).attr('class');
});

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//每次刷新页面时都随机产生新都卡片
let generateCard = function(array) {
  let newCards = shuffle(array);
  $('.deck').empty();
  for (let card of newCards) {
    $('.deck').append(`<li class="card"><i class="${card}"></i></li>`);
  };
}

$(generateCard(cardarray));

//刷新按钮
$('.restart').click(function(){
  location.reload();
});

//计时器
let second = 0;
let intervalID= setInterval(function(){
    second++;
    $('#timer').text(`${second} s`);
  },1000);


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
//记录步数，并根据步数多少评星
let moves = 0;
let stars = 3;
let move = function() {
  moves++;
  $('.moves').text(moves);
  switch(moves) {
    case 12:
            $('#thirdStar').toggleClass('fa-star fa-star-o');
            stars = 2;
            break;
    case 16:
            $('#secondStar').toggleClass('fa-star fa-star-o');
            stars = 1;
            break;
    case 20:
            $('#firstStar').toggleClass('fa-star fa-star-o');
            stars = 0;
            break;
  }
};

//翻牌
let open = [];
let openCard = function() {
  $(event.target).toggleClass('open show',true);
};

//记录已配对都牌数，当全部卡牌都配对时，显示congradulation内容
let matchCount = 0;
let cardCount = cardarray.length;
let match = function(){
  matchCount++;
  if (matchCount === cardCount/2) {
    setTimeout(function(){
      clearInterval(intervalID);
      $('.container').empty();
      $('.container').html("<div class='img row'><img src='img/success-icon.png' alt='congradulations'></div><div class='row'><h1>Congradulations! You Won!</h1><p class='info'></p><p>Woooooo!</p></div><div class='row'><button name='button' type='submit'>Play again!</button></div>");
      $('.info').text(`With ${moves} Moves and ${stars} Stars in ${second} seconds`);
      $('button').click(function(){location.reload();});
    },1500);
  };
};

//利用事件跟踪器跟踪用户点击卡牌都操作，并将记录步数的函数，翻牌函数和判断是否配对的函数与之绑定
$('.deck').click('li',function() {
  let target = $(event.target);
  if (target.attr('class') == 'card'){
    openCard();
//如果没有已翻开的卡片，载入翻卡动画
    if (open.length === 0) {
      open[0] = target;
      target.toggleClass('animated flipInY');
      setTimeout(function(){target.toggleClass('animated flipInY')},750);
    } else {
//如果有已经翻开的卡片，计步
      move();
//卡牌匹配
      if (open[0].find('i').attr('class') == target.find('i').attr('class')) {
        open[0].toggleClass('open show match animated rubberBand');
        target.toggleClass('open show match animated rubberBand');
        match();
//卡牌不匹配
      } else {
        open[0].attr('style','background-color: #ef494c');
        target.attr('style','background-color: #ef494c');
        open[0].toggleClass('animated wobble');
        target.toggleClass('animated wobble');
        let card = open[0];
        setTimeout(function() {
          card.removeAttr('style');
          target.removeAttr('style');
          card.toggleClass('wobble flipInY open show');
          target.toggleClass('wobble flipInY open show');
        },1000);
        setTimeout(function(){
          card.toggleClass('animated flipInY');
          target.toggleClass('animated flipInY');
        },2000);

      }
      open = [];
    };
  };
});
