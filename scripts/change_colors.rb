def replace(file, old_name, new_name, backed_up)
  output = `grep #{old_name} #{file}`
  if output.empty?
    false
  else
    backup_ext = backed_up ? '.tmpbak' : '.bak'
    `sed -i '#{backup_ext}' 's/#{old_name}/#{new_name}/' #{file}`
    true
  end
end

def replace_color(file, num, backed_up)
  new_num = FLAGS[:dec] ? num - 1 : num + 1
  old_name = COLOR + num.to_s
  new_name = COLOR + new_num.to_s
  replace(file, old_name, new_name, backed_up)
end

def replace_colors(file)
  backed_up = false
  enum = FLAGS[:dec] ? :each : :reverse_each
  (MIN..MAX).send(enum) do |num| 
    backed_up = replace_color(file, num, backed_up) 
  end
end

def recursive_replace_colors
  Dir.each_child(Dir.getwd) do |child|
    if SEARCH_EXTENSIONS.include?(File.extname(child))
      replace_colors(child)
    elsif File.directory?(child)
      Dir.chdir(child) { recursive_replace_colors }
    end
  end
end

def recursive_remove_temp_backups
  Dir.each_child(Dir.getwd) do |child|
    if File.extname(child) === '.tmpbak'
      `rmtrash #{child}`
    elsif File.extname(child) === '.bak'
      new_name = if BACKUP_NAMES.has_key?(child) 
        BACKUP_NAMES[child] += 1
        "#{child}_#{BACKUP_NAMES[child]}"
      else
        BACKUP_NAMES[child] = 0
        child
      end

      Dir.mkdir(TMP_DIR) unless Dir.exist?(TMP_DIR)
      `#{FLAGS[:no_backup] ? 'mv' : 'cp'} #{child} #{TMP_DIR}/#{new_name}`

    elsif File.directory?(child)
      Dir.chdir(child) { recursive_remove_temp_backups }
    end
  end
end

def recursive_remove_backups
  Dir.each_child(Dir.getwd) do |child|
    if File.extname(child) === '.bak'
      `rmtrash #{child}`
    elsif File.directory?(child)
      Dir.chdir(child) { recursive_remove_backups }
    end
  end
end

def recursive_restore_backups
  Dir.each_child(Dir.getwd) do |child|
    if File.extname(child) === '.bak'
      file_to_replace = child[0...-4]
      `mv #{child} #{file_to_replace}`
    elsif File.directory?(child)
      Dir.chdir(child) { recursive_restore_backups }
    end
  end
end

i = 0
FLAGS = {}
args = []

until i >= ARGV.length
  cur_arg = ARGV[i]
  if cur_arg.start_with?('-')
    case cur_arg[1..-1]
    when '-path', 'p'
      FLAGS[:dir] = ARGV[i + 1]
      i += 2
    when '-no-backup', 'n'
      FLAGS[:no_backup] = true
      i += 1
    when '-decrement', 'd'
      FLAGS[:dec] = true
      i += 1
    when '-restore', 'r'
      FLAGS[:restore] = true
      i += 1
    when '-clear', 'c'
      FLAGS[:clear] = true
      i += 1
    else
      raise "Unrecognized flag `#{cur_arg}`"
    end
  else
    args << cur_arg
    i += 1
  end
end

raise "Not enough arguments" if args.size < 2

ROOT_DIR = "#{__dir__}/.."
SEARCH_DIR = FLAGS[:dir] ? "#{Dir.getwd}/#{FLAGS[:dir]}" : "#{ROOT_DIR}/src"
SEARCH_EXTENSIONS = %w(css scss html js).map { |ext| ".#{ext}" }

COLOR = "\\$#{args[0]}-"
MIN = args[1].to_i
MAX = (args[2] || MIN).to_i

TMP_DIR = "#{ROOT_DIR}/tmp/#{Time.now.to_i}"
BACKUP_NAMES = {}

if FLAGS[:restore]
  puts 'Restoring backups, all other args ignored'
  Dir.chdir(SEARCH_DIR) { recursive_restore_backups }
elsif FLAGS[:clear]
  puts 'Clearing backups, all other args ignored'
  Dir.chdir(SEARCH_DIR) { recursive_remove_backups }
else
  Dir.chdir(SEARCH_DIR) { recursive_replace_colors }
  Dir.chdir(SEARCH_DIR) { recursive_remove_temp_backups }
end




