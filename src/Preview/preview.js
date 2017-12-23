const React = require('react');
const Highlight = require('react-highlight');
const classNames = require('classnames');
const Frame = require('react-frame-component').default;
const Remarkable = require('remarkable');
const hljs = require('highlight.js');
const styles = require('./styles.css');

const remarkable = new Remarkable({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: 'hljs-', // CSS language prefix for fenced blocks
  linkify: true, // Autoconvert URL-like text to links

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        return str;
      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) { return str;}

    return ''; // use external default escaping
  }
});

// TODO this is ugly, find a way to import css as a string. Maybe changing webpack loader?
const stylLight = 'html { font-family: "Roboto";} html:html,body, .frame-content, .frame-root, code, pre {height: 100%; width: 100%; }  pre { font-size: 16px; padding: 10px;}, .hljs{display:block;overflow-x:hidden;padding:.5em;color:#333;background:#f8f8f8}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:700}.hljs-number,.hljs-literal,.hljs-variable,.hljs-template-variable,.hljs-tag .hljs-attr{color:#008080}.hljs-string,.hljs-doctag{color:#d14}.hljs-title,.hljs-section,.hljs-selector-id{color:#900;font-weight:700}.hljs-subst{font-weight:400}.hljs-type,.hljs-class .hljs-title{color:#458;font-weight:700}.hljs-tag,.hljs-name,.hljs-attribute{color:navy;font-weight:400}.hljs-regexp,.hljs-link{color:#009926}.hljs-symbol,.hljs-bullet{color:#990073}.hljs-built_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999;font-weight:700}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700} blockquote{background:#f9f9f9;border-left:10px solid #ccc;margin:1.5em 10px;padding:.5em 10px;} tr, td { text-align: center} li { margin-bottom: 8px;}';

const stylDark = 'html { font-family: "Roboto"; color: #FFF;} html:html,body, .frame-content, .frame-root, code, pre {height: 100%; width: 100%; }  pre {background: #333; color: #FFF; padding:16px; font-size: 16px;}, .hljs{display:block;overflow-x:auto;padding:.5em;background:#333;color:white}.hljs-name,.hljs-strong{font-weight:700}.hljs-code,.hljs-emphasis{font-style:italic}.hljs-tag{color:#62c8f3}.hljs-variable,.hljs-template-variable,.hljs-selector-id,.hljs-selector-class{color:#ade5fc}.hljs-string,.hljs-bullet{color:#a2fca2}.hljs-type,.hljs-title,.hljs-section,.hljs-attribute,.hljs-quote,.hljs-built_in,.hljs-builtin-name{color:#ffa}.hljs-number,.hljs-symbol,.hljs-bullet{color:#d36363}.hljs-keyword,.hljs-selector-tag,.hljs-literal{color:#fcc28c}.hljs-comment,.hljs-deletion,.hljs-code{color:#888}.hljs-regexp,.hljs-link{color:#c6b4f0}.hljs-meta{color:#fc9b9b}.hljs-deletion{background-color:#fc9b9b;color:#333}.hljs-addition{background-color:#a2fca2;color:#333}.hljs a{color:inherit}.hljs a:focus,.hljs a:hover{color:inherit;text-decoration:underline} a {color: #ccc;}  li { margin-bottom: 8px;}';

/**
 * Main Preview Component
 */
class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: props.note,
      isDarkTheme: props.isDarkTheme
    };
  }

  render() {

    const cls = classNames('hljs', this.state.note.language);
    const contentStyle = this.state.isDarkTheme ? stylDark : stylLight;

    // If its Markdown note, render it as markdown
    if (this.state.note.type === 'markdown') {
      return (
        <Frame>
          <style>{contentStyle}</style>
          <div dangerouslySetInnerHTML={{ __html: remarkable.render(this.state.note.content) }}></div>
        </Frame>
      );
    }

    const snippetTitleStyle = {
      fontSize: 16
    };

    return (
        <Frame>
          <style>{contentStyle}</style>
          <h1 style={snippetTitleStyle}>{this.state.note.title}</h1>
          <Highlight className={cls}>
            {this.state.note.content}
          </Highlight>
        </Frame>
    );
  }
}

module.exports = Preview;
