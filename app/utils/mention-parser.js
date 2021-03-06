import Ember from 'ember';

function parse(body, mentions) {
  if (Ember.isPresent(body) && Ember.isPresent(mentions)) {
    return _parseMentions(body, mentions);
  } else {
    return body;
  }
}

function _generateLink(mention) {
  let username = Ember.get(mention, 'username');
  return `<a href="/${username}" class="username">@${username}</a>`;
}

function _parseMentions(body, mentions) {
  let parsedBody = '';
  let currentPosition = 0;

  mentions.forEach((mention) => {
    let indices = Ember.get(mention, 'indices');
    let startIndex = indices[0];
    let endIndex = indices[1];

    parsedBody += body.slice(currentPosition, startIndex);
    parsedBody += _generateLink(mention);
    currentPosition = endIndex + 1;
  });

  parsedBody += body.slice(currentPosition, body.length);

  return parsedBody;
}

export { parse };
