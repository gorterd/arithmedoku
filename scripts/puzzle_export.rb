require_relative 'shared'

args, flags, named_args = collects_args(arg_options: [:path])
data_dir = named_args.has_key?(:path) ? "#{Dir.getwd}/#{FLAGS[:dir]}" : DATA_DIR

imports = Dir.each_child(data_dir)
  .select { |file| file =~ /puzzle_\d+\.js$/ }
  .map.with_index { |f, i| "import p#{i + 1} from './#{f}'" }
  
exports = (1..imports.size).map { |n| "p#{n}," }

File.write("#{data_dir}/puzzles.js", <<~HERE)
  #{imports.join("\n")}

  export default [
    #{exports.join"\n\t"}
  ]
HERE