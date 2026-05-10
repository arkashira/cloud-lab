package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{
		Use:   "status",
		Short: "Display sandbox resource count and health status",
		Run: func(cmd *cobra.Command, args []string) {
			monitor := NewMonitor()
			monitor.Start()
		},
	}

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}