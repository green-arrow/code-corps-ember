import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

let mockCurrentUser = Ember.Service.extend({
  user: {
    id: 1
  }
});

let mockDifferentUser = Ember.Service.extend({
  user: {
    id: 2
  }
});

let mockPost = Ember.Object.create({
  title: 'Original title',
  body: 'A <strong>body</strong>',
  number: 12,
  postType: 'issue',
  user: {
    id: 1,
  },
  save() {
    this.set('title', this.get('title'));
    return Ember.RSVP.resolve();
  }
});

moduleForComponent('post-title', 'Integration | Component | post title', {
  integration: true,
  beforeEach() {
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{post-title}}`);
  assert.equal(this.$('.post-title').length, 1, 'The component\'s element is rendered');
});

test('it is not editable if not the right user', function(assert) {
  this.register('service:current-user', mockDifferentUser);

  assert.expect(1);
  this.render(hbs`{{post-title}}`);
  assert.equal(this.$('.post-title .edit').length, 0);
});


test('it switches between edit and view mode', function(assert) {
  assert.expect(8);

  this.register('service:current-user', mockCurrentUser);

  this.set('post', mockPost);
  this.render(hbs`{{post-title post=post}}`);

  assert.equal(this.$('.post-title.editing').length, 0, 'Component is not in edit mode');
  assert.equal(this.$('.post-title.editing input[name=title]').length, 0, 'Input element is not rendered');
  assert.equal(this.$('.post-title .title').length, 1, 'Display element is rendered');
  this.$('.post-title .edit').click();
  assert.equal(this.$('.post-title.editing').length, 1, 'Component is in edit mode');
  assert.equal(this.$('.post-title.editing input[name=title]').length, 1, 'Input element is rendered');
  assert.equal(this.$('.post-title.editing .save').length, 1, 'Save button is rendered');
  assert.equal(this.$('.post-title.editing .cancel').length, 1, 'Cancel button is rendered');
  this.$('.post-title .cancel').click();
  assert.equal(this.$('.post-title.editing').length, 0, 'Component is not in edit mode');
});

test('it saves', function(assert) {
  assert.expect(2);

  this.register('service:current-user', mockCurrentUser);

  this.set('post', mockPost);
  this.render(hbs`{{post-title post=post}}`);

  assert.equal(this.$('.post-title .title').text().trim(), 'Original title #12', 'The original title is right');

  this.$('.post-title .edit').click();
  this.$('.post-title input[name=title]').val('Edited title').trigger('change');
  this.$('.post-title .save').click();

  assert.equal(this.$('.post-title .title').text().trim(), 'Edited title #12', 'The tile title is saved');
});

// test('it resets the input element when editing is cancelled and then restarted', function(assert) {
//   assert.expect(1);
//   this.set('post', mockPost);
//   this.render(hbs`{{post-title post=post}}`);
//   this.$('.post-title .edit').click();
//   this.$('.post-title input[name=title]').val('Edited title').trigger('change');
//   this.$('.post-title .cancel').click();
//   this.$('.post-title .edit').click();
//   assert.equal(this.$('.post-title input[name=title]').val(), 'Original title', 'Input is back to the original value');
// });
