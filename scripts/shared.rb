ROOT_DIR = "#{__dir__}/.."
SRC_DIR = "#{ROOT_DIR}/src"
TMP_DIR = "#{ROOT_DIR}/tmp/#{Time.now.to_i}"
SCRIPTS_DIR = "#{ROOT_DIR}/scripts"
JS_DIR = "#{SRC_DIR}/js"
SCSS_DIR = "#{SRC_DIR}/scss"
DATA_DIR = "#{JS_DIR}/data"

def collects_args(flag_options: [], arg_options: [])
  positional_args = []
  flags = []
  named_args = {}
  
  all_options = flag_options + arg_options
  args = ARGV.dup
  while (cur_arg = args.shift)   
    if cur_arg.start_with? '-'
      matching_option = if cur_arg.start_with? '--'
        all_options.find { |opt| cur_arg[2..-1] == opt }
      else
        all_options.find { |opt| cur_arg[1..-1] == opt[0] }
      end

      raise "Unrecognized option `#{cur_arg}`" unless matching_option
      
      if flag_options.include? matching_option
        flags << matching_option.to_sym
      else
        named_args[matching_option.to_sym] = args.shift
      end
    else
      positional_args << cur_arg
    end
  end

  [positional_args, flags, named_args]
end

def get_positional_args = collects_args[0]
def get_flags(*flags) = collects_args(flag_options: flags)[1]
def get_named_args(*named_args) = collects_args(arg_options: named_args)[2]

def from_wd(*segments) = segments.unshift(Dir.getwd).join('/')
def from_root(*segments) = segments.unshift(ROOT_DIR).join('/')

def recursively_traverse_files(dir, *exts, &prc)
  Dir.chdir(dir) do 
    Dir.each_child(Dir.getwd) do |child|
      if File.directory?(child)
        recursively_traverse_files(child, *exts, &prc) 
      elsif exts.empty? || exts.include?(File.extname(child))
        prc.call(child, File.extname(child))
      end
    end
  end
end

def replace(file, old_name, new_name, backup = false)
  unless `grep #{old_name} #{file}`.empty?
    `sed -i '#{backup ? '.bak' : ''}' 's/#{old_name}/#{new_name}/' #{file}`
    backup
  end
end