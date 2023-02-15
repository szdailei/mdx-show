#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn print_help() {
    let help_str = "Usage: mdx-show [options]

    Options:
        -d, --dir <directory>     Set directory of md/mdx files. Default is current working directory
        -h, --help                Print help information
        -V, --version             Print version information";

    println!("{}", help_str);
}

use std::process;
use tauri::api::cli::get_matches;
// use tauri::command::command_path;

fn main() {
    //  println!("{}", command_path);

    let context = tauri::generate_context!();

    let cli_config = context.config().tauri.cli.clone().unwrap();
    match get_matches(&cli_config, context.package_info()) {
        Ok(matches) => {
            if matches.args.contains_key("help") {
                print_help();
                process::exit(1);
            };
            if matches.args.contains_key("version") {
                println!("{}", context.package_info().version);
                process::exit(1);
            }
            match matches.args.get("dir") {
                Some(arg_data) => {
                    if arg_data.value != false {
                        let first_char_of_path = arg_data.value.to_string().chars().nth(1).unwrap();
                        let second_char_of_path =
                            arg_data.value.to_string().chars().nth(2).unwrap();
                        if first_char_of_path == ".".chars().nth(0).unwrap()
                            && second_char_of_path == ".".chars().nth(0).unwrap()
                        {
                            println!("{}", r#"Parent dir is not allowed (i.e. "../path")"#);
                            process::exit(1);
                        }
                    }
                }
                None => (),
            }
        }
        Err(_) => {
            print_help();
            process::exit(1);
        }
    };

    tauri::Builder::default()
        .run(context)
        .expect("error while running tauri application");
}
