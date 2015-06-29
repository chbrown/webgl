/**
A helper class that wraps a single WebGLRenderingContext instance.
*/
var World = (function () {
    function World(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('webgl');
        // Initialize the WebGL context with a few basic defaults.
        this.context.viewport(0, 0, canvas.width, canvas.height);
        // enable depth testing
        this.context.enable(this.context.DEPTH_TEST);
        // less-than-or-equal so that near things obscure far things
        this.context.depthFunc(this.context.LEQUAL);
        // Set clear color to...
        // this.context.clearColor(0.0, 0.0, 0.0, 1.0); // black, fully opaque
        this.context.clearColor(0.2, 0.2, 0.2, 1.0); // nearly black, fully opaque
        // this.context.clearColor(0.5, 0.5, 0.5, 1.0); // half-gray
    }
    /**
    Creates shader, sets the source string, and compiles it, throwing an Error if it did not compile.
  
    type should be FRAGMENT_SHADER or VERTEX_SHADER
    */
    World.prototype.initializeShader = function (source, type) {
        var shader = this.context.createShader(type);
        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);
        // Ensure that it compiled successfully
        if (this.context.getShaderParameter(shader, this.context.COMPILE_STATUS) === false) {
            throw new Error("Could not compile shader: " + this.context.getShaderInfoLog(shader));
        }
        return shader;
    };
    /**
    Calls out to readShader with each selector, and pulls them together as
    one WebGL Program, attaching each Shader after compiling, then linking and
    using the Program on the current WebGL context.
    */
    World.prototype.initializeProgram = function (vertex_shader_source, fragment_shader_source) {
        var program = this.context.createProgram();
        var vertex_shader = this.initializeShader(vertex_shader_source, this.context.VERTEX_SHADER);
        this.context.attachShader(program, vertex_shader);
        var fragment_shader = this.initializeShader(fragment_shader_source, this.context.FRAGMENT_SHADER);
        this.context.attachShader(program, fragment_shader);
        this.context.linkProgram(program);
        if (this.context.getProgramParameter(program, this.context.LINK_STATUS) === false) {
            throw new Error("Could not link program: " + this.context.getProgramInfoLog(program));
        }
        this.context.useProgram(program);
        return program;
    };
    World.prototype.attachBuffer = function (vertices) {
        var buffer = this.context.createBuffer();
        // buffer.itemSize = 3;
        // buffer.numItems = vertices.length / 3;
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(vertices), this.context.STATIC_DRAW);
        return buffer;
    };
    return World;
})();
