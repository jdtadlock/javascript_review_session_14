// Set all buttons to be clickable
// and when clicked, get the name and price of the parent stock

$(document).on('click', 'tr button.favorite', function () {
  const parent_row = $(this).parents('tr');
  const name = parent_row.find('td.name').text();
  const price = parent_row.find('td.price').text();
  // console.log($(this).text());
  $.post('/api/favorites', {
    name: name,
    price: price
  }).then(res => {
    console.log(res);
  });

  $(this)
    .removeClass('favorite')
    .attr({ disabled: true })
    .text('Unfavorite');
});