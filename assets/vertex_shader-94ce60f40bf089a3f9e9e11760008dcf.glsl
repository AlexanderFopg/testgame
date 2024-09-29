attribute vec4 a_position;
attribute vec2 a_texCoord0;

uniform mat4 u_projTrans;

varying vec2 v_texCoords;
varying vec2 v_worldPosition; // World position in tiles

void main() {
    v_texCoords = a_texCoord0;
    v_worldPosition = a_position.xy; // Assuming each tile is 1 unit in size
    gl_Position = u_projTrans * a_position;
}
