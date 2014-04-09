define([],function () {
return {"demos":[{"data":{"name":"Alice","unread":7,"total":10},"name":"Alice's inbox\n","template":"<h3>Hello {{name}}!</h3>\n<p>You have <b>{{unread}}</b>/{{total}} unread messages.</p>\n\n<div class='progress'>\n   <!-- You can use JavaScript expressions in templates! -->\n   <div style='width: {{ 100 * unread / total }}%;'></div>\n</div>\n"},{"data":{"visible":false},"name":"Now you see me...\n","template":"<label>\n  <input type='checkbox' checked='{{visible}}'> visible?\n</label>\n\n{{#visible}}\n  <div intro='fly:{x:300}' outro='fly:{duration:200}'>\n    <strong class='peekaboo'>now you see me...</strong>\n  </div>\n{{/visible}}\n"},{"data":{"celsius":18,"type":"C"},"name":"SVG\n","template":"<input type='radio' name='{{type}}' value='C'>°C\n<input type='radio' name='{{type}}' value='F'>°F\n<svg>\n  <rect fill='lightblue' width='100%' height='100%'/>\n  <circle fill='gold' stroke='orange' cx='4em' cy='50%' r='3em'/>\n\n  <text x='90%' y='50%'>\n    {{type==='C' ? celsius : Math.round((celsius*1.8)+32) }}°\n  </text>\n</svg>\n"}]};
}());