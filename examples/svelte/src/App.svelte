<script lang="ts">
  import '@google-pay/save-button-element';

  let height = 'small';
  let size = '';
  let textsize = '';
  let theme = 'dark';
</script>

<style>
  main {
    font: 400 16px/24px Roboto, Noto Sans, Noto Sans JP, Noto Sans KR, Noto Naskh Arabic, Noto Sans Thai, Noto Sans Hebrew,
      Noto Sans Bengali, sans-serif;
  }

  form {
    display: inline-block;
  }

  form.top-bottom {
    margin: -4px -5px;
  }

  form.top-bottom label {
    margin-top: 10px;
  }

  form label {
    display: block;
  }

  form label.control {
    display: inline-block;
    width: 200px;
    margin: 4px 5px;
  }

  form label > span {
    display: inline-block;
    margin-right: 5px;
  }

  form label.control > span {
    display: block;
  }

  form label .value {
    font-size: 80%;
    color: #666;
  }

  form select {
    -moz-appearance: none;
    -webkit-appearance: none;
    border: 1px solid #dadce0;
    border-radius: 4px;
    box-shadow: none;
    color: #202124;
    cursor: pointer;
    display: inline-block;
    font: 500 14px/36px Google Sans, Noto Sans, Noto Sans JP, Noto Sans KR, Noto Naskh Arabic, Noto Sans Thai,
      Noto Sans Hebrew, Noto Sans Bengali, sans-serif;
    height: 36px;
    line-height: 34px;
    outline: 0;
    padding: 0 27px 0 15px;
    text-align: left;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    transition: background-color 0.2s;
    vertical-align: middle;
    white-space: nowrap;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="4" viewBox="0 0 20 4"><path d="M0,0l4,4l4-4H0z" fill="%23212121"/></svg>')
      #fff no-repeat 100%;
  }

  form.top-bottom select {
    width: 100%;
  }

  form option {
    font-weight: normal;
    display: block;
    white-space: pre;
    min-height: 1.2em;
    padding: 0 2px 1px;
  }

  form input[type='range'] {
    width: 100%;
  }

  .demo {
    margin-top: 20px;
    margin-bottom: 30px;
    min-height: 40px;
  }
</style>

<main>
  <form class="top-bottom">
    <div class="params">
      <label class="control">
        <span>Button height:</span>
        <select bind:value={height}>
          <option value="small">small</option>
          <option value="standard">standard</option>
        </select>
      </label>
      <label class="control">
        <span>Button size:</span>
        <select bind:value={size}>
          <option value="">-</option>
          <option value="matchparent">matchparent</option>
        </select>
      </label>
      <label class="control">
        <span>Button text size:</span>
        <select bind:value={textsize}>
          <option value="">-</option>
          <option value="large">large</option>
        </select>
      </label>
      <label class="control">
        <span>Button theme:</span>
        <select bind:value={theme}>
          <option value="dark">dark</option>
          <option value="light">light</option>
        </select>
      </label>
    </div>
  </form>

  <div class="demo">
    <save-to-google-pay-button
      jwt="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwOi8vbG9jYWxob3N0OjEzMzciLCJodHRwczovL3NhdmUtdG8tZ29vZ2xlLXBheS5zdGFja2JsaXR6LmlvIiwiaHR0cHM6Ly9ncGF5LWxpdmUtZGVtby1zdGFnaW5nLndlYi5hcHAiXSwiaXNzIjoic29jLWxveWFsdHlhcGktZGVtb0BhcHBzcG90LmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImxveWFsdHlPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMTAwNDg2NjguYWxleF9hdF9leGFtcGxlLmNvbS1ncGF5LXJld2FyZHMifV19LCJpYXQiOjE2MTU1OTQ2NTF9.ZbEvdvkRh5nCuBq85bBEjR6216L7j6W10nyVWpPSAZlaSe8O6hJ_Ig-TrrvFtn7aHucMZr4cTmttONrlaFU-gFKMYHMEJFiZ-qv58sE9dNUdgUwTJWWzH8aukltM0pCBLHcpvLXTCpGk4PoXWM4q5H6WIjP1Jem8v1_YGdV6J_UBNyAGqJUE5XJnDgHl2qGFilTmF0el6EBFQLnF2PuIvyZcWXgbXgJLZfx-opepVAgODW5BQjQ7li8QoDl3ffdESO2-7qWVm-VoxLb8eDh3z3gRktPb8APh_VsaAb8mjvNCLk_SOPrQhpuph4b0Rg4xnt59u5c87_eD2kT3_IuHxw"
      height={height}
      size={size}
      textsize={textsize}
      theme={theme}>
    </save-to-google-pay-button>
  </div>
</main>
