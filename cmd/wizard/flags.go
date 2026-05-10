package wizard

import (
	"github.com/spf13/cobra"
)

func AddFlags(cmd *cobra.Command) {
	cmd.Flags().StringP("aws-access-key-id", "i", "", "AWS Access Key ID")
	cmd.Flags().StringP("aws-secret-access-key", "s", "", "AWS Secret Access Key")
}