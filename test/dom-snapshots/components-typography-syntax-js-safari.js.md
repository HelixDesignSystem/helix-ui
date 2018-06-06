# Snapshot report for `built/dom-snapshots/components-typography-syntax-js-safari.js`

The actual snapshot is saved in `components-typography-syntax-js-safari.js.snap`.

Generated by [AVA](https://ava.li).

## safari on macOS 10.13 -- components/typography/test/syntax-js.html

> Snapshot 1

    `<figure data-visreg="typography-syntax-js">␊
          <figcaption>JavaScript Syntax Highlighting Example</figcaption>␊
    <pre><code class="javascript"><span class="hljs-comment">/**␊
     * @description Multi-line comment␊
     * @returns {String}␊
     */</span>␊
    <span class="hljs-comment">// Inline Comment</span>␊
    <span class="hljs-keyword">var</span> legacyVariable;␊
    <span class="hljs-keyword">const</span> REGEXP = <span class="hljs-regexp">/h(iy|ell)o*/ig</span>;␊
    <span class="hljs-keyword">const</span> array = [ <span class="hljs-literal">null</span>, <span class="hljs-literal">true</span>, <span class="hljs-literal">false</span> ];␊
    <span class="hljs-keyword">const</span> obj = {␊
      <span class="hljs-attr">number</span>: <span class="hljs-number">42</span>,␊
      <span class="hljs-attr">integer</span>: <span class="hljs-number">42.0</span>,␊
      <span class="hljs-attr">s_string</span>: <span class="hljs-string">'single quotes'</span>,␊
      <span class="hljs-attr">d_string</span>: <span class="hljs-string">"double quotes"</span>␊
    };␊
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">greet</span> (<span class="hljs-params">name: <span class="hljs-string">'World'</span></span>) </span>{␊
      <span class="hljs-keyword">if</span> (foo !== <span class="hljs-string">'bar'</span>) {␊
        <span class="hljs-keyword">return</span> <span class="hljs-string">'nope'</span>;␊
      } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (foo || bar) {␊
        <span class="hljs-keyword">return</span> <span class="hljs-string">'maybe'</span>;␊
      } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (foo &amp;&amp; bar) {␊
        <span class="hljs-keyword">return</span> <span class="hljs-string">'wut'</span>;␊
      }␊
      <span class="hljs-keyword">return</span> <span class="hljs-string">`Hello <span class="hljs-subst">${name}</span>!`</span>;␊
    }␊
    </code></pre>    </figure>`