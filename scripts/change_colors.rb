require_relative 'shared'

positional_args, flags, named_args = collects_args(
  flag_options: %w(no_backup decrement restore clear),
  arg_options: ['path']
)

SEARCH_DIR = named_args[:path]&.then { from_wd(_1) } || SRC_DIR

def traverse(*exts, &prc) 
  recursively_traverse_files(SEARCH_DIR, *exts, &prc)
end

if flags.include? :restore
  puts 'Restoring backups, all other args ignored'
  traverse('.bak') { `mv #{_1} #{_1[0...-4]}` }
elsif flags.include? :clear
  puts 'Clearing backups, all other args ignored'
  traverse('.bak') { `rm #{_1}` }
else
  raise "Not enough arguments" if positional_args.size < 2
  
  min, max = positional_args[1..2].map(&:to_i)
  max ||= min
  color = "\\$#{positional_args.first}-"
  dec = flags.include? :decrement

  traverse('.scss', '.hbs', '.js') do |file|
    backed_up = false
    (min..max).send(dec ? :each : :reverse_each) do |num, idx| 
      old_name = color + num.to_s
      new_name = color + (dec ? num - 1 : num + 1).to_s
      if replace(file, old_name, new_name, !backed_up)
        backed_up = true
        Dir.mkdir(TMP_DIR) unless Dir.exist?(TMP_DIR)
        cmd = flags.include?(:no_backup) ? 'mv' : 'cp'
        `#{cmd} #{file}.bak #{TMP_DIR}/#{file}.bak`
      end
    end
  end
end