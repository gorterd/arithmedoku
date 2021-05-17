COLOR_FILE = "#{__dir__}/../src/styles/base/colors.scss"
COLOR_REGEX = /^\$(?<color>(\w|-)+): (hsl|rgb).*;/

color_lines = File.readlines(COLOR_FILE).take_while do |ln| 
  !ln.include?('/* Color Palette */')
end

colors = color_lines.each_with_object([]) do |ln, colors|
  color_match = COLOR_REGEX.match(ln)
  colors << color_match[:color] if color_match
end

js_colors = colors.map { |c| "    '#{c}',\n" }.join('')
scss_colors = colors.map { |c| "  '#{c}': $#{c},\n" }.join('')

puts 'JS COLORS'
print js_colors
puts
puts 'SCSS COLORS'
print scss_colors