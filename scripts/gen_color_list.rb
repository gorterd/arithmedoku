require_relative 'shared'

num_spaces = { js: 4, scss: 2 }.merge(get_named_args('js', 'scss'))

colors = File.readlines("#{SCSS_DIR}/base/colors.scss")
  .take_while { |ln| !ln.include?('/* Color Palette */') } 
  .filter_map { |ln| /^\$(?<color>(\w|-)+): (hsl|rgb).*;/.match(ln) }
  .map { |match| match[:color] }

format_colors = proc do |key, format|
  indent = ' ' * num_spaces[key].to_i
  colors.map { |color| indent + format.gsub('?', color) }.join("\n")
end

puts <<~HERE
  JS COLORS
  #{format_colors.call(:js, "'?',")}
  SCSS COLORS
  #{format_colors.call(:scss, "'?': $?,")}
HERE