setup();


moduleForComponent('x-foo');

test('sets self-drop when target is the currentDrag', function() {
  expect(2);
  var component = this.subject();
  equal(component.get('self-drop'), false);
  component._handleDragOver(fakeSelfDrag());
  equal(component.get('self-drop'), true);
});

test('sets self-drop when currentDrag contains target', function() {
  expect(2);
  var component = this.subject();
  equal(component.get('self-drop'), false);
  component._handleDragOver(fakeChildTargetDrag());
  equal(component.get('self-drop'), true);
});

test('does not set self-drop when target is not the currentDrag', function() {
  expect(2);
  var component = this.subject();
  equal(component.get('self-drop'), false);
  component._handleDragOver(fakeNotSelfDrag());
  equal(component.get('self-drop'), false);
});

test('sets accepts-drag', function() {
  expect(2);
  var component = this.subject();
  equal(component.get('accepts-drag'), false);
  component._handleDragOver(fakeNotSelfDrag());
  equal(component.get('accepts-drag'), true);
});

test('allows the event to be dropped', function() {
  expect(2);
  var component = this.subject();
  var event = fakeNotSelfDrag();
  component._handleDragOver(event);
  equal(event.stopPropagationCount, 1);
  equal(event.preventDefaultCount, 1);
});

test('calls acceptDrop on drop', function() {
  expect(2);
  var component = this.subject();
  var event = fakeNotSelfDrag();
  component._handleDragOver(event);
  component._handleDrop(event);
  ok(component.dropAccepted);
  equal(component.droppedEvent, event);
});

function setup() {
  emq.globalize();
  setResolver(Ember.DefaultResolver.extend({
    map: {
      'component:x-foo': Ember.Component.extend(ic.Droppable.default, {
        acceptDrop: function(event) {
          this.droppedEvent = event;
          this.dropAccepted = true;
        } 
      })
    },
    resolve: function(fullName) {
      return this.get('map')[fullName] || this._super.apply(this, arguments);
    }
  }).create());
}

var Droppable = ic.Droppable.default;

function fakeSelfDrag() {
  var fakeTarget = {};
  Droppable._currentDrag = fakeTarget;
  return fakeEvent({
    target: fakeTarget
  });
}

function fakeNotSelfDrag() {
  var fakeTarget = {};
  Droppable._currentDrag = {
    contains: function() { return false; }
  };
  return fakeEvent({
    target: fakeTarget
  });
}

function fakeChildTargetDrag() {
  var fakeTarget = {};
  Droppable._currentDrag = {
    contains: function() { return true; }
  };
  return fakeEvent({
    target: fakeTarget
  });
}

function fakeEvent(ext) {
  var e = {
    stopPropagationCount: 0,
    preventDefaultCount: 0,
    stopPropagation: function() {
      this.stopPropagationCount++;
    },
    preventDefault: function() {
      this.preventDefaultCount++;
    }
  };
  for (var key in ext) e[key] = ext[key];
  return e;
}

