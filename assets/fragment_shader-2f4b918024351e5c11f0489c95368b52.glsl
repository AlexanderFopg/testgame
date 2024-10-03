#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;    // Block texture
uniform sampler2D u_lightmap;   // Lightmap texture
uniform vec2 u_lightmapSize;    // Size of the lightmap (in tiles)

varying vec2 v_texCoords;
varying vec2 v_worldPosition;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoords);

    // Calculate lightmap UV coordinates
    vec2 lightmapUV = v_worldPosition / u_lightmapSize;

    // Sample the lightmap
    vec4 lightColor = texture2D(u_lightmap, lightmapUV);

    // Modulate the texture color with the light color and intensity
    gl_FragColor = texColor * lightColor;
}
